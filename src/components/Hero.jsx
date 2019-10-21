import React from 'react';

import RateHistory from './RateHistory';
import Interface from './Interface';

const Hero = (props) => (
  <div className="hero">
    <div className="container relative">
      <RateHistory {...props} />
      <Interface {...props} />
    </div>
  </div>
);

export default Hero;
