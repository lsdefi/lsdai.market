import PropTypes from 'prop-types';
import React from 'react';
import BigNumber from 'bignumber.js';
import InfoBox from './InfoBox';

import { animateOut, spin } from '../utils/animate';

class Drawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { props } = this;
    const {
      address,
      cDaiBalance,
      contractAddresses,
      daiBalance,
      hedgeOrder,
      longDBalance,
      sellOrder,
      shortDBalance,
    } = props;

    const close = (evt) => {
      evt.preventDefault();
      window.Header.open = false;
      animateOut('.drawer', 'slideOutRight', 'faster');
    };

    const placeHedgeOrderDai = async () => {
      spin('.daiIcon', true);
      spin('.longDIcon', true);
      await hedgeOrder({
        cDai: cDaiBalance,
        dai: daiBalance,
        months: 12,
        side: 'borrow',
      });
      spin('.daiIcon', false);
      spin('.longDIcon', false);
    };

    const placeHedgeOrderCDai = () => {
      spin('.cDaiIcon', true);
      spin('.shortDIcon', true);
      hedgeOrder({
        cDai: cDaiBalance,
        dai: daiBalance,
        months: 12,
        side: 'lend',
      });
      spin('.cDaiIcon', false);
      spin('.shortDIcon', false);
    };

    const placeSellOrderLongD = () => {
      spin('.longDIcon', true);
      sellOrder({
        amount: longDBalance,
        tokenAddress: contractAddresses.longD,
      });
      spin('.longDIcon', false);
    };

    const placeSellOrderShortD = () => {
      spin('.shortDIcon', true);
      sellOrder({
        amount: shortDBalance,
        tokenAddress: contractAddresses.shortD,
      });
      spin('.shortDIcon', false);
    };

    return (
      <div className="drawer hidden">
        <div>
          <a href="/" alt="close" onClick={close} className="close">
            <i className="fal fa-window-close" />
          </a>
          <div className="top">
            <h1>Balances</h1>
            <span className="text-green text-xs">{address}</span>
          </div>

          <ul>
            <li onClick={placeHedgeOrderDai}>
              <img src="../assets/images/dai.svg" alt="Dai" className="daiIcon" />
              { daiBalance.dp(5).toFixed() }
              <span>DAI</span>
            </li>
            <li onClick={placeHedgeOrderCDai}>
              <img src="../assets/images/cdai.svg" alt="cDai" className="cDaiIcon" />
              { cDaiBalance.dp(5).toFixed() }
              <span>cDAI</span>
            </li>
            <li onClick={placeSellOrderLongD}>
              <img src="../assets/images/longD.svg" alt="longD" className="longDIcon" />
              { longDBalance.dp(5).toFixed() }
              <span>longD</span>
            </li>
            <li onClick={placeSellOrderShortD}>
              <img src="../assets/images/shortD.svg" alt="shortD" className="shortDIcon" />
              { shortDBalance.dp(5).toFixed() }
              <span>shortD</span>
            </li>
          </ul>
        </div>
        <div className="mt-auto mb-12">
          <InfoBox color="blue">
            <strong>Information</strong>
            <br />
            <br />

            Click on your cDai or Dai balance to create a 12 month hedge order.
            <br />
            <br />

            Click on your longD or shortD balances to sell your stash.
            <br />
            <br />

            LSDai balances move with the supply rate of cDai. A movement of
            1% corresponds to a $1 change in the price of longD or shortD.
            <br />
            <br />

            As the supply rate decreases, shortD gains in value. As it increases,
            longD gains in value.
            <br />
            <br />

            As with any product of this nature, irresponsible use can lead to
            a bad trip, regret, and general loss of money.
          </InfoBox>
        </div>
      </div>
    );
  }
}

Drawer.defaultProps = {
  cDaiBalance: BigNumber(100.00),
  daiBalance: BigNumber(0),
  longDBalance: BigNumber(0),
  shortDBalance: BigNumber(0),
};

Drawer.propTypes = {
  address: PropTypes.string.isRequired,
  cDaiBalance: PropTypes.instanceOf(BigNumber),
  contractAddresses: PropTypes.shape({
    longD: PropTypes.string.isRequired,
    shortD: PropTypes.string.isRequired,
  }).isRequired,
  daiBalance: PropTypes.instanceOf(BigNumber),
  hedgeOrder: PropTypes.func.isRequired,
  longDBalance: PropTypes.instanceOf(BigNumber),
  sellOrder: PropTypes.func.isRequired,
  shortDBalance: PropTypes.instanceOf(BigNumber),
};

export default Drawer;
