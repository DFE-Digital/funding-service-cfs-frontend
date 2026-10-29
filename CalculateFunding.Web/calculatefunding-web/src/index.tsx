import * as React from "react";
import { Provider } from "react-redux";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import logger from "redux-logger";
import thunk, { ThunkMiddleware } from "redux-thunk";

import AppContainer from "./containers/AppContainer";
import * as Mirage from "./mirage";
import { IStoreState, rootReducer } from "./reducers/rootReducer";
import { initialiseAxios } from "./services/axiosInterceptor";
import { createRoot } from 'react-dom/client';

const TypeFixAppContainer = AppContainer as any;
const container : any = document.getElementById("main-content")
const root : any = createRoot(container!);

Mirage.interceptBrowserRequests();

initialiseAxios();

let middleware : any = [thunk as ThunkMiddleware<IStoreState>];

if (process.env.NODE_ENV === "development") {
  middleware = [...middleware, logger];
}

const store: Store<IStoreState> = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

root.render(
  <Provider store={store}>
    <TypeFixAppContainer />
  </Provider>,
);
