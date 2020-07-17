const chalk = require("chalk");

const info = (data) => {
  return console.log(chalk.blue(data));
};
const dev = (data) => {
  return console.log(chalk.green(data));
};
const error = (data) => {
  return console.log(chalk.red(data));
};

const logger = {
  info,
  dev,
  error,
};

module.exports = {
  logger,
};
