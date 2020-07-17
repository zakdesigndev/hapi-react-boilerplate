"use strict";

module.exports = {
  paths: ["app/tests"],
  coverage: true,
  threshold: 80,
  "context-timeout": 5000,
  lint: false,
  "coverage-exclude": "app/tests",
  reporter: ["html", "console"],
  output: ["./coverage/backend/coverage.html", "stdout"],
  verbose: true,
  debug: true,
  colors: true,
};
