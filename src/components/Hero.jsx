import React from 'react';

import RateHistory from './RateHistory';

const Hero = (props) => (
  <div className="hero">
    <div className="container relative">
      <RateHistory {...props} />
    </div>
  </div>
);

export default Hero;
