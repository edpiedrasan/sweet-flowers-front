import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { verifyToken } from 'helpers/verifyToken.jsx';

const PrivateRoute = ({ ...props }) => {
   const hasToken = verifyToken();
  if (!hasToken) {
    return <Redirect to="/" />;
  } else {
    return <Route {...props} />;
  }
};

export default PrivateRoute;
