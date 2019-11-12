import React from 'react';

import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'react-tabs';

import BetPanel from './BetPanel';
import HedgePanel from './HedgePanel';
import MakeMarketsPanel from './MakeMarketsPanel';
import InfoBox from './InfoBox';

const Interface = (props) => (
  <div className="tab-container">
    <Tabs>
      <TabList>
        <Tab>Hedge</Tab>
        <Tab>Bet</Tab>
        <Tab>Make Markets</Tab>
      </TabList>

      <TabPanel>
        <HedgePanel {...props} />
      </TabPanel>
      <TabPanel>
        <BetPanel {...props} />
      </TabPanel>
      <TabPanel>
        <MakeMarketsPanel {...props} />
      </TabPanel>
    </Tabs>
    <div className="central-alert rounded">
      <span className="text-lg">
        <span className="text-xl">🚧</span>&nbsp;&nbsp;Coming back soon
        <br /><br />
        Upgrading to Multi Collateral DAI&nbsp;&nbsp;<span className="text-xl">🛠</span>️
      </span>
    </div>
  </div>
);

export default Interface;
