import React from 'react';

import Github from './Github';
import Telegram from './Telegram';
import Twitter from './Twitter';

const Content = () => (
  <div id="content">
    <div id="logos">
      <img src="./assets/images/logo.svg" alt="logo" className="logo" />
      <img src="./assets/images/LSDai.svg" alt="LSDai" className="logo name" />
    </div>

    <h4>Hedge, Bet, and Make Markets on cDai Interest</h4>
    <p>Launching on October 20th, 2019</p>
    <Github />
    <Telegram />
    <Twitter />
  </div>
);

export default Content;
