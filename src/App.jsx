import React from 'react';
import './styles.css';

import Content from './components/Content';

const App = () => (
  <div>
    <Content />
    <img
      src="./assets/images/landing-bg-right.svg"
      alt=""
      className="landing-right lg:block lg:w-5/12 lg:float-right lg:h-screen"
    />
  </div>
);

export default App;
