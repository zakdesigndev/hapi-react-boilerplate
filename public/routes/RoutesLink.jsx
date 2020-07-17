"use strict";

import { connect } from "react-redux";
import { withRouter } from "react-router";

import Routes from "./Routes";

const mapStateToProps = (state, props) => {
    return {
        ...props,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const routesLink = connect(mapStateToProps, mapDispatchToProps)(Routes);

export default withRouter(routesLink);
