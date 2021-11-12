'use strict';

module.exports = {
  port: process.env.PORT || 8442,
  db: {
    uri: process.env.MONGO_URL,
  },

};
