"use strict";

module.exports = (server) => {
  //static routes
  require("./static")(server);
  //server routes
  // require("./server")(server);
  /**
   * Add ui routes in last section
   */
  require("./ui")(server);
};
