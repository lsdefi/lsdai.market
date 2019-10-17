import React from 'react';
import Github from './logos/Github';
import Telegram from './logos/Telegram';
import Twitter from './logos/Twitter';

const Footer = () => (
  <div className="footer">
    <div className="container">
      <img src="../assets/images/logo-with-writing-white.png" alt="lsdai logo" />
      <p>
        Disclaimer: Money legos are dangerous when stacked incorrectly.
        LSDai does not endorse using any substance which will cause your vision to become impaired
        or otherwise prevent you from operating heavy machinery / Metamask.
        Nothing hearin should be taken as trading advice, life advice, or even good advice.
        Use at your own risk.
      </p>
      <div>
        <div>
          © LSDeFi (a collective work of Yellow Hat DAO, Decentral.ee, & Cryptobuilders).
        </div>
        <div className="text-right">
          <Github />
          <Telegram />
          <Twitter />
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
