"use strict";
const config = require("config");

module.exports = (server) => {
  server.route({
    method: "GET",
    path: "/{path*}",
    options: {
      handler: async (request, handle) => {
        const env = config.get("environment") == "development" ? "development" : "production";
        return handle.view("index", { env });
      },
    },
  });
};
