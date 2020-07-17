"use strict";

import "core-js/stable";
import "regenerator-runtime/runtime";
import React from "react";
import { render } from "react-dom";
import { persistStore } from "redux-persist";

import { history, configureStore } from "./_store";
import App from "./App";
import "./styles/styles.scss";

const store = configureStore();
const persistor = persistStore(store);

const renderApp = (Component) => {
    render(
        <Component history={history} store={store} persistor={persistor} />,
        document.getElementById("app")
    );
};

renderApp(App);

if (module.hot) {
    module.hot.accept("./App", () => {
        renderApp(App);
    });
}
