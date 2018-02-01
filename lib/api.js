var config = require('../config.js');

module.exports = {
  getUrl(route) {
    return `${config.host}${config.basePath}${route}`;
    // return `https://${config.host}${config.basePath}${route}`;
  },
};