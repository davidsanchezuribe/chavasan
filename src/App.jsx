import 'core-js/stable';
import 'regenerator-runtime/runtime';

import ReactDOM from 'react-dom';
import React from 'react';

import { Router } from '@reach/router';
import withStyle from './withStyle';
import { LocalizationContext, withLocalization } from './withLocalization';
// @imports

const NoMatch = () => <h1>Page Not Found</h1>;
const basepath = BASE_PATH;

const HomePage = () => {
  const messages = React.useContext(LocalizationContext);
  return (
    <h1>{messages.homepage.helloWorld}</h1>
  );
}

const RoutedApp = () => (
  <div> 
    <Router basepath={basepath}>
      <HomePage path="/" />
      <NoMatch default />
    </Router>
  </div>
);

const RoutedAppWithLocalization = withLocalization(RoutedApp);
const RoutedAppWithStyle = withStyle(RoutedAppWithLocalization);

const contentNode = document.getElementById('root');
ReactDOM.render(<RoutedAppWithStyle />, contentNode);

if (module.hot) {
  module.hot.accept();
}
