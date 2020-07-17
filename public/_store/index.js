"use strict";

import { createBrowserHistory } from "history";
import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { composeWithDevTools } from "redux-devtools-extension";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { BehaviorSubject } from "rxjs";
import { switchMap } from "rxjs/operators";

import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import epics from "../_epics";
import reducers from "../_reducers";

const persistConfig = {
    key: "root",
    storage,
    stateReconciler: (inboundState, originalState, reducedState) => {
        return inboundState;
    },
};

const history = createBrowserHistory();

const configureStore = () => {
    const reducer = combineReducers({
        ...reducers,
        router: connectRouter(history),
    });

    const epicMiddleware = (store) => {
        const originalEpicMiddleware = createEpicMiddleware({
            dependencies: {
                dispatch: store.dispatch,
            },
        });

        const storeMiddleware = originalEpicMiddleware(store);

        epicMiddleware.run = originalEpicMiddleware.run;

        return storeMiddleware;
    };
    const router = routerMiddleware(history);
    const loggerMiddleware = createLogger();

    const middlewares = [epicMiddleware, router];

    const epic$ = new BehaviorSubject(epics);

    const hotReloadingEpic = (...args) =>
        epic$.pipe(switchMap((epic) => epic(...args)));

    let configuredStore = {};

    if (process.env.NODE_ENV === "production") {
        configuredStore = createStore(
            persistReducer(persistConfig, reducer),
            compose(applyMiddleware(...middlewares))
        );
    } else {
        configuredStore = createStore(
            persistReducer(persistConfig, reducer),
            composeWithDevTools(
                applyMiddleware(...middlewares, loggerMiddleware)
            )
        );
    }

    epicMiddleware.run(hotReloadingEpic);

    if (module.hot) {
        module.hot.accept("../_epics", () => {
            const nextRootEpic = require("../_epics").default;
            epic$.next(nextRootEpic);
        });
    }
    return configuredStore;
};

export { history, configureStore };
