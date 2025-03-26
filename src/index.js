/*!

=========================================================
* Vision UI Free Chakra - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-chakra
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-chakra/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

// react redux library for store
import { Provider } from "react-redux";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import RTLLayout from "layouts/RTL.js";
import SignIn from "views/Pages/SignIn";

import PrivateRoute from "PrivateRoute.jsx";
import { IndexSmartAutomation } from "./SmartAutomation/IndexSmartAutomation";

  window.location.hash = '';



ReactDOM.render(
  <HashRouter>
    <Switch>
      <PrivateRoute path="/admin" component={AdminLayout} />
      <PrivateRoute path="/automation" component={IndexSmartAutomation} />

      {/* <Route path={`/auth`} component={AuthLayout} />
        <Route path={`/admin`} component={AdminLayout} />
        <Route path={`/rtl`} component={RTLLayout} />
        <Redirect from={`/`} to='/admin/dashboard' /> */}

      <Route path={"/"} component={SignIn} />
      <Redirect from="*" to="/" />

    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
