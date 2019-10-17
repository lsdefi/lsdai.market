import React from 'react';

const Header = () => (
  <div className="header">
    <div className="container relative">
      <div className="logos">
        <img src="./assets/images/logo.jpg" alt="logo" className="logo" />
        <img src="./assets/images/LSDai.svg" alt="LSDai" className="logo name" />
      </div>

      <button className="wallet" type="button">
        <img src="./assets/images/metamask-logo.png" alt="metamask" className="metamask" />
        My Balance
      </button>
    </div>
  </div>
);

export default Header;
