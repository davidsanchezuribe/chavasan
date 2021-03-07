import 'core-js/stable';
import 'regenerator-runtime/runtime';

import ReactDOM from 'react-dom';
import React, { useState } from 'react';

import { Router, Match } from '@reach/router';
import withStyle from './withStyle';
import { withLocalization } from './withLocalization';
import { userStateUtil } from './firebase';
import SignInForm from './SignInForm.jsx';
import NavBar from './NavBar.jsx';
import HomePage from './HomePage.jsx';

const NoMatch = () => <h1>Page Not Found</h1>;
const basepath = BASE_PATH;

const RoutedApp = () => {
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');

  const userStatus = (userArg) => {
    if (userArg) {
      setUser(userArg.uid);
    } else {
      setUser(null);
    }
  };

  userStateUtil(userStatus);

  const toast = (messageArg) => {
    setMessage(messageArg);
    setShowToast(true);
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div>
      <Match path="/">
        {(props) => (
          <NavBar
            {...props}
            showToast={showToast}
            message={message}
            closeToast={closeToast}
            toast={toast}
          />
        )}
      </Match>
      { user !== null
        ? (
          < Router basepath={basepath}>
            <HomePage path="/" user={user}/>
            <NoMatch default />
          </Router>
        ) : (
          <Router basepath={basepath}>
            <SignInForm
              path="/"
              toast={toast}
            />
          </Router>
        )
      }
    </div >
  )
};

const RoutedAppWithLocalization = withLocalization(RoutedApp);
const RoutedAppWithStyle = withStyle(RoutedAppWithLocalization);

const contentNode = document.getElementById('root');
ReactDOM.render(<RoutedAppWithStyle />, contentNode);

if (module.hot) {
  module.hot.accept();
}
