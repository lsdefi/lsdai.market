import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import InfoBox from './InfoBox';
// import PropTypes from 'prop-types';
import React from 'react';

export default () => (
  <div className="tab-container">
    <Tabs>
      <TabList>
        <Tab>Hedge</Tab>
        <Tab>Bet</Tab>
        <Tab>Make Market</Tab>
      </TabList>

      <TabPanel>
        <p>Protect yourself against wild rate swings</p>
        <div>
          <div className="inline-block m-3">
            <input
              type="radio"
              id="borrow"
              name="borrowOrLend"
              value="borrow"
              checked
            />
            <label htmlFor="borrow">I'm borrowing DAI</label>
          </div>
          <div className="inline-block m-3">
            <input
              type="radio"
              id="lend"
              name="borrowOrLend"
              value="lend"
            />
            <label htmlFor="lend">I'm lending DAI</label>
          </div>
        </div>
        <InfoBox>
          Hedge your rate exposure by shorting the interest rate. If the lending rate goes down, the value of your short position will go up. You can sell it back to the market, take profit, and make up for lost lending revenue.
        </InfoBox>
        <div className="quantity-box">
          <div>
            <span>I have</span>
            <input
              type="text"
              id="quantity"
              name="quantity"
              required
              minLength="1"
              maxLength="18"
              size="3"
            />
            <span>cDAI and will hold it for</span>
            <input
              type="text"
              id="months"
              name="months"
              required
              minLength="1"
              maxLength="2"
              size="1"
            />
            <span>
              months.
            </span>
          </div>
          <div className="w-full text-right">
            <button type="button" className="button-black">
              HEDGE
            </button>

          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <InfoBox>
          lorem lorem lorem
        </InfoBox>
        <p className="font-bold font-2xl">I think the cDai lending rate on Compound will go:</p>
        <div className="up-down">
          <img src="../assets/images/up.svg" alt="when clicked, apply class selected" />
          <img src="../assets/images/down.svg" alt="down" />
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
      </TabPanel>
      <TabPanel>
        <InfoBox>
          lorem lorem lorem
        </InfoBox>
        <div className="coming-soon">
          <h1>Coming Soon</h1>
        </div>
      </TabPanel>
    </Tabs>
  </div>
);
