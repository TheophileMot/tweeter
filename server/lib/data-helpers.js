'use strict';

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require('./util/simulate-delay');


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection('tweets').insert(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => a.createdAt - b.createdAt;
      db.collection('tweets').find().toArray((err, data) => {
        if (err) {
          throw err;
        } else {
          callback(null, data.sort(sortNewestFirst));
        }
      });
    }
  };
};
