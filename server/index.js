'use strict';

// Basic express setup:

const PORT          = 8080;
const express       = require('express');
const bodyParser    = require('body-parser');
const app           = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = 'mongodb://localhost:27017/tweeter';

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  // We have a connection to the 'tweeter' db, starting here.
  console.log(`Connected to mongodb: ${MONGODB_URI}`);

  const dataHelpers = require('./lib/data-helpers.js')(db);
  const tweetsRoutes = require('./routes/tweets')(dataHelpers);
  app.use('/tweets', tweetsRoutes);

  // db.close();
});

app.listen(PORT, () => {
  console.log('Tweeter listening on port ' + PORT);
});
