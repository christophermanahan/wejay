const searchRouter = require('express').Router();
const SC = require('node-soundcloud');
// APPenv.js

const config = {
  id: process.env.SC_CLIENT_ID,
  secret: process.env.SC_CLIENT_SECRET
}

SC.init(config)

searchRouter.get('/tracks/:query', function(req, res, next) {
  SC.get('/tracks', {
    q: req.params.query
  }, function(err, results) {
    if ( err ) {
      throw err;
    } else {
      res.json(results)
      //here is where we would only take certain result keys on the song object
    }
  })
})

module.exports = searchRouter;
