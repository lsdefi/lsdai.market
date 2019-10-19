import BigNumber from 'bignumber.js';
import Gun from 'gun/gun';
import PropTypes from 'prop-types';
import React from 'react';
import ReactNotification from 'react-notifications-component';
import Web3Connect from 'web3connect';
import { ethers as eth } from 'ethers';

import './styles.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Team from './components/Team';
import Press from './components/Press';
import Footer from './components/Footer';

import Airswap from './airswap';
import animate from './utils/animate';
import balance from './utils/balance';
import erc20 from './abi/erc20';
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

    this.hedgeOrder = this.hedgeOrder.bind(this);

    window.App = this;
  }

  componentWillUnmount() {
    this.airswap.stop();
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

  async hedgeOrder({
    cDai,
    dai,
    months,
    side,
  }) {
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
      const riskedRateIncrease = BigNumber(20).minus(supplyRate);
      console.log('riskedRateIncrease', riskedRateIncrease.toFixed());
      const riskedRateIncreaseD = riskedRateIncrease.dividedBy(100);
      console.log('riskedRateIncrease', riskedRateIncrease.toFixed());
      const potentialAnnualCost = BigNumber(dai).times(riskedRateIncreaseD);
      console.log('potentialAnnualCost', potentialAnnualCost.toFixed());
      const potentialCost = potentialAnnualCost.times(aprAdjustment);
      console.log('potentialCost', potentialCost.toFixed());
      const longD = potentialCost.dividedBy(riskedRateIncrease);
      console.log('longD', longD.toFixed());

      this.airswap.getOrder(longD.multipliedBy(10 ** 5).dp(0), contractAddresses.longD);
    }

    // side lend
    // current rate - 5 = risked rate decrease
    // calculate total cost if rate immediately changed
    //  - value of cDai * (risked rate decrease / 100) * (months / 12)
    // risked amount / risked rate decrease = number of shortD
    //
    if (side === 'lend') {
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
      const shortD = potentialCost.dividedBy(riskedRateDecrease);
      console.log('shortD', shortD.toFixed());

      this.airswap.getOrder(shortD.multipliedBy(10 ** 5).dp(0), contractAddresses.shortD);
    }
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
      hedgeOrder,
      props,
      state,
    } = this;

    const orderMethods = {
      hedgeOrder,
    };

    return (
      <div className="app">
        <ReactNotification />
        <Header {...props} {...state} />
        <Hero {...props} {...state} {...orderMethods} />
        <Team {...props} {...state} />
        <Press {...props} {...state} />
        <Footer {...props} {...state} />
      </div>
    );
  }
}

App.propTypes = {
  contractAddresses: PropTypes.shape({
    cDai: PropTypes.string.isRequired,
    dai: PropTypes.string.isRequired,
    longD: PropTypes.string.isRequired,
    shortD: PropTypes.string.isRequired,
  }).isRequired,
  gun: PropTypes.instanceOf(Gun).isRequired,
  web3Connect: PropTypes.instanceOf(Web3Connect.Core).isRequired,
};

export default App;
