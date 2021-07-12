import "core-js/stable";
import "regenerator-runtime/runtime";
import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';

render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app')
);
