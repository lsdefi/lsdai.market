import React from 'react';

const Header = () => (
  <div className="header">
    <div className="container">
      <img src="./assets/images/logo-with-writing.jpg" alt="logo" />

      <button className="wallet" type="button">
        <img src="./assets/images/metamask-logo.png" alt="metamask" className="metamask" />
        My Balance
      </button>
    </div>
  </div>
);

export default Header;
