import React from 'react';

import InfoBox from './InfoBox';

const MakeMarketsPanel = () => (
  <div>
    <InfoBox>
      Contact us on&nbsp;
      <a href="/" target="_blank">Telegram</a>
      &nbsp;or&nbsp;
      <a href="/" target="_blank">Intercom</a>
      &nbsp;if you&apos;d like instructions on how to make your own
      markets immediately.
    </InfoBox>
    <div className="coming-soon">
      <h1>Coming Soon</h1>
    </div>
  </div>
);

export default MakeMarketsPanel;
