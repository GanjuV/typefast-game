/**
 *    Date: 16 February 2021
 *    Description: Basic API expose code
 *    Version: 1.0
 *    Author: Vaibhav Ganju
 */
const fs = require("fs");
module.exports = (app) => {
  // API routes
  fs.readdirSync(__dirname + "/api/").forEach((file) => {
    require(`./api/${file.substr(0, file.indexOf("."))}`)(app);
  });
};
