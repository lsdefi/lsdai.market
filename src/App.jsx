import React from 'react';
import './styles.css';

import Header from './components/Header';
import Hero from './components/Hero';
import Team from './components/Team';
import Press from './components/Press';
import Footer from './components/Footer';

const App = (props) => (
  <div className="app">
    <Header {...props} />
    <Hero {...props} />
    <Team {...props} />
    <Press {...props} />
    <Footer {...props} />
  </div>
);

export default App;
