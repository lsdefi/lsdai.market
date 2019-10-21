import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React from 'react';

import InfoBox from './InfoBox';

class BetPanel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dai: 1,
      direction: 'up',
    };

    this.submit = this.submit.bind(this);
    this.updateDai = this.updateDai.bind(this);
    this.updateDaiFallback = (evt) => this.updateDai(evt, 0);
  }

  submit(evt) {
    evt.preventDefault();
    const { props, state } = this;
    const { betOrder } = props;
    betOrder(state);
  }

  updateDai(evt, fallback = '') {
    evt.preventDefault();
    this.clean = false;
    const dai = BigNumber(evt.target.value).toNumber();
    if (Number.isNaN(dai)) {
      this.setState({ dai: fallback });
    } else {
      this.setState({ dai });
    }
  }

  render() {
    const {
      state,
      submit,
      updateDai,
      updateDaiFallback,
    } = this;
    const { dai, direction } = state;

    return (
      <div className="bet">
        <InfoBox>
          The price of the tokens only moves between 5% and 20%. If the supply rate is 5% or below,
          LongD is worth nothing. If the price is 20% or above, ShortD is worth nothing.
        </InfoBox>

        <p className="font-bold font-2xl">I think the cDai lending rate on Compound will go:</p>
        <div className="up-down">
          <img
            src="./assets/images/up.svg"
            alt="up"
            onClick={() => this.setState({ direction: 'up' })}
            className={direction === 'up' ? 'hidden' : ''}
          />
          <img
            src="./assets/images/up-selected.svg"
            alt="up"
            onClick={() => this.setState({ direction: 'up' })}
            className={direction === 'up' ? 'selected' : 'hidden'}
          />
          <img
            src="./assets/images/down.svg"
            alt="down"
            onClick={() => this.setState({ direction: 'down' })}
            className={direction === 'down' ? 'hidden' : ''}
          />
          <img
            src="./assets/images/down-selected.svg"
            alt="down"
            onClick={() => this.setState({ direction: 'down' })}
            className={direction === 'down' ? 'selected' : 'hidden'}
          />
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
              maxLength="4"
              size="3"
              onBlur={updateDaiFallback}
              onChange={updateDai}
              value={dai}
            />
            <span>
              DAI for every percentage point the cDai supply rate
              {direction === 'up' ? ' increases.' : ' decreases.'}
            </span>
          </div>
          <div className="w-full text-right">
            <button type="button" className="button-black" onClick={submit}>
              BET
            </button>
          </div>
        </div>
      </div>
    );
  }
}

BetPanel.propTypes = {
  betOrder: PropTypes.func.isRequired,
};

export default BetPanel;
