"use strict";

const hapi = require("@hapi/hapi");
const config = require("config");
const { logger } = require("./app/helpers/logger.helper");
const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const routes = require("./app/routes");
const Twig = require("twig");

/**
 *
 * hapi Server
 */
const server = new hapi.server({
  port: config.get("server.port"),
  host: config.get("server.host"),
  routes: {
    files: {
      relativeTo: "./public",
    },
    validate: {
      failAction: async (request, h, err) => {
        if (config.get("environment") === "production") {
          console.error("ValidationError:", err.message);
        } else {
          // During development, log and respond with the full error.
          console.error(err);
          throw err;
        }
      },
    },
  },
});
/**
 * add plugins
 */
const plugins = [inert, vision];

/**
 * configure view engine
 */

const views = {
  engines: {
    twig: {
      compile: (src, options) => {
        const template = Twig.twig({ id: options.filename, data: src });
        return (context) => {
          return template.render(context);
        };
      },
    },
  },
  relativeTo: "./public",
  path: "views",
};

const init = async () => {
  await server.register(plugins);
  /**
   * add view engine
   */

  server.views(views);
  /**
   * add socket io services
   */

  /**
   * load routes here
   *
   */
  routes(server);

  await server.start();

  logger.info(`Configured environment is ${config.get("environment")}`);
  logger.info(`Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  logger.error(err);
  process.exit(1);
});

server.ext("onPreResponse", (request, reply) => {
  // console.log(request.response.error);
  return reply.continue;
});

init();
