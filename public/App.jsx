"use strict";

import React, { Component } from "react";
import PropTypes from "prop-types";

import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import RouteLink from "./routes/RoutesLink";
import { PersistGate } from "redux-persist/integration/react";
import { hot } from "react-hot-loader/root";

class App extends Component {
    static get propTypes() {
        return {
            history: PropTypes.object.isRequired,
            store: PropTypes.object.isRequired,
        };
    }

    constructor(props) {
        super(props);
    }
    //   componentDidMount() {
    //     const jssStyles = document.querySelector("#jss-server-side");
    //     if (jssStyles) {
    //       console.log("found");
    //       jssStyles.parentElement.removeChild(jssStyles);
    //     }
    //   }

    //   componentDidUpdate() {
    //     const jssStyles = document.querySelector("#jss-server-side");
    //     if (jssStyles) {
    //       jssStyles.parentElement.removeChild(jssStyles);
    //     }
    //   }

    render() {
        return (
            <Provider store={this.props.store}>
                <PersistGate loading={null} persistor={this.props.persistor}>
                    <ConnectedRouter history={this.props.history}>
                        <RouteLink />
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default hot(App);
