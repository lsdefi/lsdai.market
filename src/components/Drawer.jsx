import PropTypes from 'prop-types';
import React from 'react';
import BigNumber from 'bignumber.js';
import InfoBox from './InfoBox';

class Drawer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    window.App = this;
  }

  render() {
    const { props } = this;
    const {
      address,
      cDaiBalance,
      daiBalance,
      longDBalance,
      shortDBalance,
    } = props;

    const drawerWidth = 300;
    return (
      <div className="drawer" style={{ width: `${drawerWidth}px` }}>
        <div>
          <div className="top">
            <h1>Balances</h1>
          </div>

          <ul>
            <li>
              <img src="../assets/images/dai.svg" alt="Dai" />
              { daiBalance }
              <span>DAI</span>
            </li>
            <li>
              <img src="../assets/images/cdai.svg" alt="cDai" />
              { cDaiBalance }
              <span>cDAI</span>
            </li>
            <li>
              <img src="../assets/images/longD.svg" alt="longD" />
              { longDBalance }
              <span>longD</span>
            </li>
            <li>
              <img src="../assets/images/shortD.svg" alt="shortD" />
              { shortDBalance }
              <span>shortD</span>
            </li>
          </ul>
        </div>
        <div className="mt-auto mb-12">
          <InfoBox color="blue">
            This is just some random blue text
            <br />
            on multiple lines
          </InfoBox>
        </div>
      </div>
    );
  }
}

Drawer.defaultProps = {
  cDaiBalance: 100.00,
  daiBalance: undefined,
  longDBalance: undefined,
  shortDBalance: undefined,
};

Drawer.propTypes = {
  address: PropTypes.string.isRequired,
  cDaiBalance: PropTypes.number,
  // cDaiBalance: PropTypes.instanceOf(BigNumber),
  daiBalance: PropTypes.instanceOf(BigNumber),
  longDBalance: PropTypes.instanceOf(BigNumber),
  shortDBalance: PropTypes.instanceOf(BigNumber),
};

export default Drawer;
