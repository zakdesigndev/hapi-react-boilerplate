"use strict";

module.exports = (server) => {
  server.route({
    method: "GET",
    path: "/dist/{filename*}",
    options: {
      handler: {
        file: function (request) {
          return "dist/" + request.params.filename;
        },
      },
    },
  });

  server.route({
    method: "GET",
    path: "/styles/images/{filename*}",
    options: {
      handler: {
        file: function (request) {
          return "styles/images/" + request.params.filename;
        },
      },
      cache: {
        privacy: "public",
        statuses: [200],
        expiresIn: 24 * 60 * 60 * 1000,
      },
    },
  });

  server.route({
    method: "GET",
    path: "/styles/{filename*}",
    options: {
      handler: {
        file: function (request) {
          return "styles/" + request.params.filename;
        },
      },
    },
  });
};

// Cache-Control: no-cache, max-age=0, stale-while-revalidate=300
