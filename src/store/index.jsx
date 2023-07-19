import { applyMiddleware, compose, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import reducers from 'reducers/index.jsx';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const storeDev = createStore(
  reducers, {}, composeEnhancers(
    applyMiddleware(promiseMiddleware)));

const storeProd = createStore(reducers, {}, applyMiddleware(promiseMiddleware));

export const getStore = () => {
  if (process.env.NODE_ENV === "production") {
    // console.log(process.env.NODE_ENV);
    return storeProd;
  } else {
    // console.log(process.env.NODE_ENV);
    return storeDev;
  }
}