'use strict';

const GenericError = require('./error');

class BadReqestError extends GenericError {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.getCode = this.getCode.bind(this);
    }

    getCode() {
        return this.code;
    };
}

module.exports = BadReqestError;
