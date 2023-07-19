import { createAction } from 'redux-actions';
import urls from "api/urls.jsx";
// import * as constants from "constants/index.jsx";
import * as method from "api/index.jsx";

// export const authUser = createAction("AUTH_USER", user => method.post(urls.SIGNIN.auth, user)());

export const authUser =  (props) => method.post(urls.SIGNIN.auth, props)();
