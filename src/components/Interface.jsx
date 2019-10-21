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
  </div>
);

export default Interface;
