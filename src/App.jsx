import BigNumber from 'bignumber.js';
import Gun from 'gun/gun';
import PropTypes from 'prop-types';
import React from 'react';
import ReactNotification from 'react-notifications-component';
import Web3Connect from 'web3connect';
import { ethers as eth } from 'ethers';

import './styles.css';

import Header from './components/Header';
import Drawer from './components/Drawer';
import Hero from './components/Hero';
import Team from './components/Team';
// import Press from './components/Press';
import Footer from './components/Footer';

import Airswap from './airswap';
import airswapABI from './abi/airswap';
import animate from './utils/animate';
import balance from './utils/balance';
import erc20 from './abi/erc20';
import getCurrentGasPrices from './utils/getCurrentGasPrices';
import notify from './utils/notify';

class App extends React.Component {
  constructor(props) {
    super(props);

    const { web3Connect } = props;

    web3Connect.on('connect', (provider) => {
      this.updateEthers(provider);
    });

    this.state = {
      address: '',
      ethers: eth.getDefaultProvider(),
      signer: undefined,
    };

    this.betOrder = this.betOrder.bind(this);
    this.hedgeOrder = this.hedgeOrder.bind(this);
    this.sellOrder = this.sellOrder.bind(this);
    this.updateBalances = this.updateBalances.bind(this);

    window.App = this;
  }

  componentWillUnmount() {
    this.airswap.stop();
  }

  async betOrder({ dai, direction }) {
    await this.connect();

    const { contractAddresses } = this.props;
    const { longD, shortD } = contractAddresses;
    const tokenAddress = direction === 'up' ? longD : shortD;
    console.log('tokenAddress', tokenAddress);
    const amountI = BigNumber(dai).multipliedBy(10 ** 5);
    console.log('amountI', amountI.toFixed());

    try {
      const order = await this.airswap.getOrder(amountI, tokenAddress);
      return this.executeOrder(order);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async connect() {
    await this.connectWallet();
    await this.connectAirswap();
  }

  async connectWallet() {
    const { props, state } = this;
    const { signer } = state;

    if (!signer) {
      await new Promise((resolve, reject) => {
        const { web3Connect } = props;

        web3Connect.on('close', () => reject());
        web3Connect.toggleModal();

        const pid = setInterval(() => {
          if (this.airswap) {
            clearInterval(pid);
            resolve();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(pid);
          reject();
        }, 10 * 60 * 1000);
      });
    }
  }

  async connectAirswap() {
    console.log('connect airswap');
    if (!this.airswap) {
      throw new Error('No Airswap!');
    }

    await this.airswap.connection;
    await this.airswap.authenticate();
  }

  async executeOrder(order, type = 'buy') {
    const expiration = BigNumber(order.expiration).multipliedBy(1000);
    const now = BigNumber((new Date()).valueOf());
    const timeout = expiration.minus(now).toNumber();
    let cost;
    let humanAmount;

    if (type === 'buy') {
      cost = BigNumber(order.takerAmount).dividedBy(10 ** 18).dp(2).toFixed();
      humanAmount = BigNumber(order.makerAmount).dividedBy(10 ** 5).toFixed();
    } else {
      cost = BigNumber(order.makerAmount).dividedBy(10 ** 18).dp(2).toFixed();
      humanAmount = BigNumber(order.takerAmount).dividedBy(10 ** 5).toFixed();
    }

    const action = type === 'buy' ? 'purchased' : 'sold';

    await notify({
      dismiss: {
        duration: timeout,
        onScreen: true,
      },
      message: `${humanAmount} can be ${action} for ${cost} DAI.\nClick here to complete the order.`,
      title: 'Order Quote',
    });

    if (expiration.isGreaterThan((new Date()).valueOf())) {
      notify({ message: 'Sign the transaction to complete your order.' });

      const transaction = await this.fillOrder(order);
      console.log('transaction', transaction);

      await this.updateBalances();
    } else {
      notify({
        message: 'Order expired',
        type: 'warning',
      });
    }
  }

  // address makerAddress, uint makerAmount, address makerToken,
  // address takerAddress, uint takerAmount, address takerToken,
  // uint256 expiration, uint256 nonce, uint8 v, bytes32 r, bytes32 s
  async fillOrder({
    expiration,
    makerAddress,
    makerAmount,
    makerToken,
    nonce,
    r,
    s,
    takerAddress,
    takerAmount,
    takerToken,
    v,
  }) {
    const { airswap } = this.state;

    const currentGasPrices = await getCurrentGasPrices();

    const transactionParams = {
      gasPrice: eth.utils.bigNumberify(currentGasPrices.fastest.plus(1000000000).toString()),
    };

    return airswap.fill(
      makerAddress,
      makerAmount,
      makerToken,
      takerAddress,
      takerAmount,
      takerToken,
      expiration,
      nonce,
      v,
      r,
      s,
      transactionParams,
    );
  }

  async hedgeOrder({
    cDai,
    dai,
    months,
    side,
  }) {
    let amount;
    let tokenAddress;

    await this.connect();

    const { contractAddresses, gun } = this.props;

    const exchangeRate = await new Promise((resolve) => {
      gun.get('exchangeRate').once(({ rate }) => resolve(rate));
    });
    console.log('exchangeRate', exchangeRate);

    const supplyRate = await new Promise((resolve) => {
      gun.get('supplyRate').once(({ rate }) => resolve(rate));
    });
    console.log('supplyRate', supplyRate);

    const aprAdjustment = BigNumber(months).dividedBy(12);
    console.log('aprAdjustment', aprAdjustment.toFixed());

    // side borrow
    // 20 - current rate = risked rate increase
    // calculate total cost if rate immediately changed
    //  - dai * (risked rate increase / 100) * (months / 12)
    // risked amount / risked rate increase = number of longD
    //
    if (side === 'borrow') {
      tokenAddress = contractAddresses.longD;

      const riskedRateIncrease = BigNumber(20).minus(supplyRate);
      console.log('riskedRateIncrease', riskedRateIncrease.toFixed());
      const riskedRateIncreaseD = riskedRateIncrease.dividedBy(100);
      console.log('riskedRateIncrease', riskedRateIncrease.toFixed());
      const potentialAnnualCost = BigNumber(dai).times(riskedRateIncreaseD);
      console.log('potentialAnnualCost', potentialAnnualCost.toFixed());
      const potentialCost = potentialAnnualCost.times(aprAdjustment);
      console.log('potentialCost', potentialCost.toFixed());
      amount = potentialCost.dividedBy(riskedRateIncrease);
      console.log('longD', amount.toFixed());
    }

    // side lend
    // current rate - 5 = risked rate decrease
    // calculate total cost if rate immediately changed
    //  - value of cDai * (risked rate decrease / 100) * (months / 12)
    // risked amount / risked rate decrease = number of shortD
    //
    if (side === 'lend') {
      tokenAddress = contractAddresses.shortD;

      const riskedRateDecrease = BigNumber(supplyRate).minus(5);
      console.log('riskedRateDecrease', riskedRateDecrease.toFixed());
      const riskedRateDecreaseD = riskedRateDecrease.dividedBy(100);
      console.log('riskedRateDecreaseD', riskedRateDecreaseD.toFixed());
      const cDaiValue = BigNumber(cDai).times(exchangeRate);
      console.log('cDaiValue', cDaiValue.toFixed());
      const potentialAnnualCost = cDaiValue.times(riskedRateDecreaseD);
      console.log('potentialAnnualCost', potentialAnnualCost.toFixed());
      const potentialCost = potentialAnnualCost.times(aprAdjustment);
      console.log('potentialCost', potentialCost.toFixed());
      amount = potentialCost.dividedBy(riskedRateDecrease);
      console.log('shortD', amount.toFixed());
    }

    const amountI = amount.multipliedBy(10 ** 5).dp(0);
    console.log('amountI', amountI.toFixed());

    try {
      const order = await this.airswap.getOrder(amountI, tokenAddress);
      return this.executeOrder(order);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async sellOrder({ amount, tokenAddress }) {
    await this.connect();

    const amountI = BigNumber(amount).multipliedBy(10 ** 5);
    console.log('amountI', amountI.toFixed());

    try {
      const order = await this.airswap.getOrder(amountI, tokenAddress, 'sell');
      return this.executeOrder(order, 'sell');
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async updateBalances() {
    const {
      address,
      cDai,
      dai,
      longD,
      shortD,
    } = this.state;

    const [
      cDaiBalance,
      daiBalance,
      longDBalance,
      shortDBalance,
    ] = await Promise.all([
      balance(cDai, address),
      balance(dai, address),
      balance(longD, address),
      balance(shortD, address),
    ]);

    this.setState({
      cDaiBalance,
      daiBalance,
      longDBalance,
      shortDBalance,
    });
  }

  async updateEthers(provider) {
    const ethers = new eth.providers.Web3Provider(provider);
    const signer = ethers.getSigner();
    const address = (await signer.getAddress()).toLowerCase();

    if (this.lastAddress === address) {
      return;
    }

    this.lastAddress = address;

    const { props } = this;
    const { contractAddresses } = props;

    const airswap = new eth.Contract(contractAddresses.airswap, airswapABI, signer);
    const cDai = new eth.Contract(contractAddresses.cDai, erc20, signer);
    const dai = new eth.Contract(contractAddresses.dai, erc20, signer);
    const longD = new eth.Contract(contractAddresses.longD, erc20, signer);
    const shortD = new eth.Contract(contractAddresses.shortD, erc20, signer);

    const [
      cDaiBalance,
      daiBalance,
      longDBalance,
      shortDBalance,
    ] = await Promise.all([
      balance(cDai, address),
      balance(dai, address),
      balance(longD, address),
      balance(shortD, address),
    ]);

    await animate('.wallet span', 'fadeOut', 'fastest');

    this.setState({
      address,
      airswap,
      cDai,
      cDaiBalance,
      dai,
      daiBalance,
      ethers,
      longD,
      longDBalance,
      shortD,
      shortDBalance,
      signer,
    }, async () => {
      notify({
        title: 'Connected to Web3!',
        message: `Using wallet: ${address}`,
      });

      if (this.airswap) {
        this.airswap.stop();
      }

      this.airswap = new Airswap({ ...props, ...this.state });

      animate('.wallet span', 'fadeIn', 'faster');
      animate('.metamask', 'tada');
    });
  }

  render() {
    const {
      betOrder,
      hedgeOrder,
      props,
      sellOrder,
      state,
      updateBalances,
    } = this;

    const orderMethods = {
      betOrder,
      hedgeOrder,
      sellOrder,
      updateBalances,
    };

    return (
      <div className="app">
        <ReactNotification />
        <Header {...props} {...state} {...orderMethods} />
        <Drawer {...props} {...state} {...orderMethods} />
        <Hero {...props} {...state} {...orderMethods} />
        <Team {...props} {...state} />
        <Footer {...props} {...state} />
      </div>
    );
  }
}

App.defaultProps = {
  airswap: undefined,
};

App.propTypes = {
  airswap: PropTypes.instanceOf(eth.Contract),
  contractAddresses: PropTypes.shape({
    airswap: PropTypes.string.isRequired,
    cDai: PropTypes.string.isRequired,
    dai: PropTypes.string.isRequired,
    longD: PropTypes.string.isRequired,
    shortD: PropTypes.string.isRequired,
  }).isRequired,
  gun: PropTypes.instanceOf(Gun).isRequired,
  web3Connect: PropTypes.instanceOf(Web3Connect.Core).isRequired,
};

export default App;
