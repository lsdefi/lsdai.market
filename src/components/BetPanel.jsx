import React from 'react';

import InfoBox from './InfoBox';

const BetPanel = () => (
  <div>
    <InfoBox>
      lorem lorem lorem
    </InfoBox>
    <p className="font-bold font-2xl">I think the cDai lending rate on Compound will go:</p>
    <div className="up-down">
      <img src="./assets/images/up.svg" alt="when clicked, apply class selected" />
      <img src="./assets/images/down.svg" alt="down" />
    </div>

    <div className="quantity-box">
      <div>
        <span>I want to make</span>
        <input
          type="text"
          id="profit"
          name="profit"
          required
          minLength="1"
          maxLength="2"
          size="3"
        />
        <span>DAI for every additional percentage point of increase/decrease in rate.</span>
      </div>
      <div className="w-full text-right">
        <button type="button" className="button-black">
          BET
        </button>
      </div>
    </div>
  </div>
);

export default BetPanel;
