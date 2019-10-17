import Gun from 'gun/gun';
import React from 'react';
import { render } from 'react-dom';

import App from './App';

const gun = Gun();
window.gun = gun;

render(<App gun={gun} />, document.getElementById('App'));
