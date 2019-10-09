import React from 'react';

import Github from './Github';
import Telegram from './Telegram';
import Twitter from './Twitter';

const Content = () => (
  <div id="content" className="p-8 lg:float-left lg:w-7/12 md:p-16 xl:p-32 xxl:p-56">
    <div id="logos" className="lg:pt-36">
      <img src="./assets/images/logo.jpg" alt="logo" className="logo" />
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
