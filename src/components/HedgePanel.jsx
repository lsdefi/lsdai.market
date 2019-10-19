import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';
import React from 'react';

import InfoBox from './InfoBox';

class HedgePanel extends React.Component {
  constructor(props) {
    super(props);

    this.clean = true;
    this.state = {
      cDai: props.cDaiBalance ? props.cDaiBalance.dp(0).toNumber() : 0,
      dai: props.daiBalance ? props.daiBalance.dp(0).toNumber() : 0,
      months: 6,
      side: 'lend',
    };

    this.submit = this.submit.bind(this);
    this.updateCDai = this.updateCDai.bind(this);
    this.updateCDaiFallback = (evt) => this.updateCDai(evt, 0);
    this.updateDai = this.updateDai.bind(this);
    this.updateDaiFallback = (evt) => this.updateDai(evt, 0);
    this.updateMonths = this.updateMonths.bind(this);
    this.updateMonthsFallback = (evt) => this.updateMonths(evt, 1);
    this.updateSide = this.updateSide.bind(this);
  }

  componentDidUpdate() {
    if (this.clean) {
      const { props, state } = this;
      const { cDaiBalance, daiBalance } = props;

      if (cDaiBalance && state.cDai !== cDaiBalance.dp(0).toNumber()) {
        setTimeout(() => this.setState({ cDai: cDaiBalance.dp(0).toNumber() }), 0);
      }

      if (daiBalance && state.dai !== daiBalance.dp(0).toNumber()) {
        setTimeout(() => this.setState({ dai: daiBalance.dp(0).toNumber() }), 0);
      }
    }
  }

  submit(evt) {
    evt.preventDefault();
    const { props, state } = this;
    const { hedgeOrder } = props;
    console.log(hedgeOrder);
    hedgeOrder(state);
  }

  updateCDai(evt, fallback = '') {
    evt.preventDefault();
    this.clean = false;
    const cDai = BigNumber(evt.target.value).toNumber();
    if (Number.isNaN(cDai)) {
      this.setState({ cDai: fallback });
    } else {
      this.setState({ cDai });
    }
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

  updateMonths(evt, fallback = '') {
    evt.preventDefault();
    this.clean = false;
    const months = BigNumber(evt.target.value).toNumber();
    if (Number.isNaN(months)) {
      this.setState({ months: fallback });
    } else {
      this.setState({ months });
    }
  }

  updateSide(evt) {
    const side = evt.target.value;
    console.log(side);
    this.setState({ side });
  }

  render() {
    const {
      state,
      submit,
      updateCDai,
      updateCDaiFallback,
      updateDai,
      updateDaiFallback,
      updateMonths,
      updateMonthsFallback,
      updateSide,
    } = this;

    const {
      cDai,
      dai,
      months,
      side,
    } = state;

    const lending = side === 'lend';

    return (
      <div>
        <p>Protect yourself against wild rate swings</p>
        <div>
          <div className="inline-block m-3">
            <input
              type="radio"
              id="borrow"
              name="borrowOrLend"
              value="borrow"
              onChange={updateSide}
              checked={!lending}
            />
            <label htmlFor="borrow">I&apos;m borrowing DAI</label>
          </div>
          <div className="inline-block m-3">
            <input
              type="radio"
              id="lend"
              name="borrowOrLend"
              value="lend"
              onChange={updateSide}
              checked={lending}
            />
            <label htmlFor="lend">I&apos;m lending DAI</label>
          </div>
        </div>
        <InfoBox>
          Hedge your interest rate exposure by
          {lending ? ' shorting ' : ' going long on '}
          the cDai supply rate. If it goes
          {lending ? ' down, ' : ' up, '}
          the value of your
          {lending ? ' short ' : ' long '}
          position will go up. You can sell it back to the market,
          take profit, and make up for
          {lending ? ' lost lending revenue.' : ' extra interest paid.'}
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
              onChange={lending ? updateCDai : updateDai}
              onBlur={lending ? updateCDaiFallback : updateDaiFallback}
              value={lending ? cDai : dai}
            />
            <span>
              {lending ? 'c' : ''}
              DAI and will hold it for
            </span>
            <input
              type="text"
              id="months"
              name="months"
              required
              minLength="1"
              maxLength="2"
              size="1"
              onChange={updateMonths}
              onBlur={updateMonthsFallback}
              value={months}
            />
            <span>
              months.
            </span>
          </div>
          <div className="w-full text-right">
            <button type="button" className="button-black" onClick={submit}>
              HEDGE
            </button>
          </div>
        </div>
      </div>
    );
  }
}

HedgePanel.defaultProps = {
  cDaiBalance: BigNumber(0),
  daiBalance: BigNumber(0),
};

HedgePanel.propTypes = {
  cDaiBalance: PropTypes.instanceOf(BigNumber),
  daiBalance: PropTypes.instanceOf(BigNumber),
  hedgeOrder: PropTypes.func.isRequired,
};

export default HedgePanel;
