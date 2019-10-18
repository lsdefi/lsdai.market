import PropTypes from 'prop-types';
import React from 'react';
import Web3Connect from 'web3connect';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.connectWallet = this.connectWallet.bind(this);
  }

  componentDidUpdate() {
    const { props } = this;
    const { address } = props;

    console.log('ADDRESS', address);
  }

  connectWallet(evt) {
    evt.preventDefault();

    const { web3Connect } = this.props;
    web3Connect.toggleModal();
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
            {address.length > 0 ? 'My Balance' : 'Connect'}
          </button>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  address: PropTypes.string.isRequired,
  web3Connect: PropTypes.instanceOf(Web3Connect.Core).isRequired,
};

export default Header;
