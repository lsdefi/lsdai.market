import React from 'react';

import BetPanel from './BetPanel';
import HedgePanel from './HedgePanel';
import MakeMarketsPanel from './MakeMarketsPanel';
import InfoBox from './InfoBox';

class Interface extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tab: 'hedge',
    };

    this.bet = this.bet.bind(this);
    this.hedge = this.hedge.bind(this);
    this.make = this.make.bind(this);
  }

  bet() {
    this.setState({ tab: 'bet' });
  }

  hedge() {
    this.setState({ tab: 'hedge' });
  }

  make() {
    this.setState({ tab: 'make' });
  }

  render() {
    const {
      bet,
      hedge,
      make,
      props,
      state,
    } = this;
    const { tab } = state;

    return (
      <div className="tab-container">
        <div className="tabs-wrapper">
          <ul className="tabs">
            <li className={tab === 'hedge' ? 'tab selected' : 'tab'} onClick={hedge}>
              Hedge
            </li>
            <li className={tab === 'bet' ? 'tab selected' : 'tab'} onClick={bet}>
              Bet
            </li>
            <li className={tab === 'make' ? 'tab selected' : 'tab'} onClick={make}>
              Make Markets
            </li>
          </ul>

          <div className={tab === 'hedge' ? 'tab-panel' : 'hidden'}>
            <HedgePanel {...props} />
          </div>
          <div className={tab === 'bet' ? 'tab-panel' : 'hidden'}>
            <BetPanel {...props} />
          </div>
          <div className={tab === 'make' ? 'tab-panel' : 'hidden'}>
            <MakeMarketsPanel {...props} />
          </div>
        </div>
        <div className="central-alert rounded">
          <span className="text-lg">
            <span className="text-xl">🚧</span>&nbsp;&nbsp;Coming back soon
            <br /><br />
            Upgrading to Multi Collateral DAI&nbsp;&nbsp;<span className="text-xl">🛠</span>️
          </span>
        </div>
      </div>
    );
  }
}

export default Interface;
