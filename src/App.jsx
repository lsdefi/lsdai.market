import PropTypes from 'prop-types';
import React from 'react';
import Web3Connect from 'web3connect';
import { ethers as eth } from 'ethers';

import './styles.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Team from './components/Team';
import Press from './components/Press';
import Footer from './components/Footer';

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
  }

  async updateEthers(provider) {
    const ethers = new eth.providers.Web3Provider(provider);
    const signer = ethers.getSigner();
    const address = await signer.getAddress();

    this.setState({
      address,
      ethers,
      signer,
    });
  }

  render() {
    const { props, state } = this;

    return (
      <div className="app">
        <Header {...props} {...state} />
        <Hero {...props} {...state} />
        <Team {...props} {...state} />
        <Press {...props} {...state} />
        <Footer {...props} {...state} />
      </div>
    );
  }
}

App.propTypes = {
  web3Connect: PropTypes.instanceOf(Web3Connect.Core).isRequired,
};

export default App;
