import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

/**
 * @author Tim Amis <t.amis1@uni.brighton.ac.uk>
 * @see {@link https://github.com/BigTimbo/zapApp}
 *
 * The index serves as the ReactDom root to render the App component.
 */
ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorkerRegistration.register();