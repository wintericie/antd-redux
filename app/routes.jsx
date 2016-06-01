"use strict";

import React from 'react';
import { Router, Route, Link, IndexRoute, hashHistory, Redirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';
import Store from './store';
//layout
import App from './layouts/app.component';
import Manage from './layouts/manage.component';
import Login from './pages/login/login.page';
//pages
import AccountsIndex from './pages/accounts/index';
import OrdersIndex from './pages/orders/index';
import DashBoardIndex from './pages/dashboard/index.page';

const history = syncHistoryWithStore(hashHistory, Store);

const Routes = React.createClass({
  checkLogin(next, replace) {
    let isLogin = Store.getState().Auth.isLogin;
    if (!isLogin && !this.checkLocalSession()) {
      replace('/login');
    }
  },
  checkLocalSession() {
    let localToken = window.localStorage.getItem('session');
    if (localToken) {
      Store.dispatch({
        type: 'LOGINSUCCESS',
        payload: {
          token: localToken
        }
      });
      return true;
    } else {
      return false;
    }
  },
  render() {
    return (
      <Provider store={Store}>
        <Router history={history}>
          <Route component={App} >
            <Route path="/login" component={Login} />
            <Route path="/" component={Manage} onEnter={this.checkLogin}>
              <IndexRoute component={DashBoardIndex}/>
              <Route path="accounts" component={AccountsIndex} />
              <Route path="orders" component={OrdersIndex} />
            </Route>
          </Route>
          <Redirect from="*" to="/" />
        </Router>
      </Provider>
    );
  }
});

export default Routes;