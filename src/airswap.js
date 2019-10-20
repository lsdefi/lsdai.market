import BigNumber from 'bignumber.js';
import uuid from 'uuid/v4';
import { ethers } from 'ethers';

import erc20 from './abi/erc20';
import notify from './utils/notify';

window.uuid = uuid;

class Airswap {
  constructor(props) {
    this.authorized = false;
    this.props = props;
    this.resolvers = {};
    this.timeoutPids = {};

    this.connect();
  }

  get connected() {
    return this.ws && this.ws.readState === WebSocket.OPEN;
  }

  get signer() {
    const { props } = this;
    const { signer } = props;
    return signer;
  }

  async approve(token, amount) {
    // check if already approved for amount
    const {
      address,
      contractAddresses,
      max256,
      signer,
    } = this.props;
    const { airswap } = contractAddresses;
    const erc20Contract = new ethers.Contract(token, erc20, signer);
    const amountApproved = await erc20Contract.allowance(address, airswap);

    // if not, approve for max
    if (BigNumber(amountApproved).isLessThan(amount)) {
      await erc20Contract.approve(airswap, max256);
    }
  }

  async authenticate() {
    if (this.signingRequest) {
      notify({
        dismiss: { duration: 5000 },
        message: 'Connecting to Airswap',
        title: 'Please wait...',
        type: 'info',
      });

      this.sendSigned(this.signingRequest);
      await this.authorization;
      this.authorized = true;
      this.cleanup();
      console.log('Airswap authorized');
    }
  }

  cleanup() {
    delete this.signingRequest;
    delete this.authorization;
    delete this.authorize;
    this.setDefaultReceive();
  }

  connect() {
    this.authorized = false;
    this.connection = new Promise((resolve) => {
      this.conn = resolve;
    });
    console.log('connecting to Airswap websocket...');
    this.ws = new WebSocket('wss://connect.airswap.io/websocket');
    this.ws.onclose = () => this.onClose();
    this.ws.onerror = () => this.onError();
    this.ws.onmessage = (evt) => this.receiveAuthenticationRequest(evt);
    this.ws.onopen = () => console.log('Airswap connection opened');
  }

  async getMaxQuote(token, type = 'buy') {
    const { contractAddresses } = this.props;
    const { dai } = contractAddresses;

    if (!this.authorized) {
      await this.authenticate();
    }

    const id = uuid();
    const jsonrpc = '2.0';
    const method = 'getMaxQuote';
    const params = {
      makerToken: dai,
      takerToken: dai,
    };

    if (type === 'buy') {
      params.makerToken = token;
    } else {
      params.takerToken = token;
    }

    return this.sendMessage({
      id,
      jsonrpc,
      method,
      params,
    });
  }

  async getOrder(amount, token, type = 'buy') {
    if (!this.authorized) {
      await this.authenticate();
    }

    const { address, contractAddresses } = this.props;
    const { dai, longD } = contractAddresses;
    const tokenName = token === longD ? 'LongD' : 'ShortD';
    const humanAmount = BigNumber(amount).dividedBy(10 ** 5).dp(5).toFixed();

    notify({
      dismiss: { duration: 10000 },
      message: `Asking to ${type} ${humanAmount} ${tokenName}`,
      title: 'Please wait...',
      type: 'info',
    });

    const id = uuid();
    const jsonrpc = '2.0';
    const method = 'getOrder';
    const params = {
      makerToken: dai,
      takerAddress: address,
      takerToken: dai,
    };

    if (type === 'buy') {
      params.makerAmount = amount;
      params.makerToken = token;
    } else {
      params.takerAmount = amount;
      params.takerToken = token;
    }

    await this.approve(params.takerToken, params.takerAmount);

    const message = {
      id,
      jsonrpc,
      method,
      params,
    };

    return this.sendMessage(message);
  }

  onClose() {
    console.log('Airswap connection closed');
    this.reset();
    setTimeout(() => { this.connect(); }, 500);
  }

  onError(evt) {
    console.error(evt, this);
  }

  onMessage(evt) {
    console.log('Airswap event received', evt);

    this.safeReceive(() => {
      const payload = JSON.parse(evt.data);
      this.lastPayload = payload;
      if (payload.message) {
        this.receiveMessageResponse(payload);
      }
      console.log('AIRSWAP WS PAYLOAD', payload);
    });
  }

  queueAuthentication(message) {
    console.log('authentication queued');
    this.authorization = new Promise((resolve) => { this.authorize = resolve; });
    this.authorized = false;
    this.conn();
    this.signingRequest = message;
    this.ws.onmessage = (e) => this.receiveAuthenticationResponse(e);
  }

  receiveAuthenticationRequest(evt) {
    this.safeReceive(() => {
      if (evt.data.match(/^By signing this message/)) {
        this.queueAuthentication(evt.data);
        return;
      }

      this.onMessage(evt);
    });
  }

  receiveAuthenticationResponse(evt) {
    this.safeReceive(() => {
      if (evt.data === 'ok') {
        this.authorize();
        return;
      }

      this.onMessage(evt);
    });
  }

  receiveMessageResponse({ message, receiver, sender }) {
    const { address, makerAddress } = this.props;

    if (receiver === address && sender === makerAddress) {
      const { id, result } = JSON.parse(message);
      clearTimeout(this.timeoutPids[id]);
      this.resolvers[id](result);
      delete this.resolvers[id];
      delete this.timeoutPids[id];
    }
  }

  reset() {
    this.cleanup();
    this.authorized = false;
    delete this.ws;
  }

  safeReceive(func) {
    try {
      func();
    } catch (e) {
      this.receiveError = e;
      console.error('Unable to process message from Airswap', e);
    }
  }

  send(payload) {
    console.log('Sending payload to Airswap', payload);
    this.ws.send(payload);
  }

  sendMessage(message) {
    const { address, makerAddress } = this.props;

    console.log('message', message);

    const payload = {
      id: uuid(),
      message: JSON.stringify(message),
      receiver: makerAddress,
      sender: address,
    };

    console.log('payload', payload);

    this.send(JSON.stringify(payload));

    // TODO: hook up receivers
    return new Promise((resolve, reject) => {
      this.timeoutPids[message.id] = setTimeout(() => {
        reject(new Error(`${message.id} timed out`));
      }, 1 * 60 * 1000);

      this.resolvers[message.id] = resolve;
    });
  }

  async sendSigned(message) {
    this.send(await this.signer.signMessage(message));
  }

  setDefaultReceive() {
    this.ws.onmessage = (evt) => this.onMessage(evt);
  }

  stop() {
    this.connect = () => {};
    this.cleanup();
    this.ws.close();
  }
}

export default Airswap;
