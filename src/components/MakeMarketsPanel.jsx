import React from 'react';

import InfoBox from './InfoBox';

const MakeMarketsPanel = () => (
  <div>
    <InfoBox>
      Contact us on&nbsp;
      <a href="https://t.me/lsdai" target="_blank" rel="noopener noreferrer">Telegram</a>
      &nbsp;or&nbsp;
      <a href="/" onClick={window.showIntercom}>Intercom</a>
      &nbsp;if you&apos;d like instructions on how to make your own
      markets immediately.
    </InfoBox>
    <div className="coming-soon">
      <h1>Coming Soon</h1>
    </div>
  </div>
);

export default MakeMarketsPanel;
