import PropTypes from 'prop-types';
import React from 'react';
import Web3Connect from 'web3connect';

import { animateIn, animateOut } from '../utils/animate';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.connectWallet = this.connectWallet.bind(this);
    this.open = false;
  }

  connectWallet(evt) {
    evt.preventDefault();

    const { props } = this;
    const { address, updateBalances } = props;

    if (address === '') {
      const { web3Connect } = this.props;
      web3Connect.toggleModal();
    } else {
      if (this.open) {
        this.open = false;
        animateOut('.drawer', 'slideOutRight', 'faster');
        return;
      }

      this.open = true;
      updateBalances();
      animateIn('.drawer', 'slideInRight', 'faster');
    }
  }

  render() {
    const { props } = this;
    const { address } = props;

    return (
      <div className="header">
        <div className="container">
          <img src="./assets/images/logo-with-writing.jpg" alt="logo" />
          <button className="wallet" onClick={this.connectWallet} type="button">
            <img src="./assets/images/eth-logo.png" alt="ethereum" className="metamask" />
            <span>{address.length > 0 ? 'My Balances' : 'Connect'}</span>
          </button>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  address: PropTypes.string.isRequired,
  updateBalances: PropTypes.func.isRequired,
  web3Connect: PropTypes.instanceOf(Web3Connect.Core).isRequired,
};

export default Header;
