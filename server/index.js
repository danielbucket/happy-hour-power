const express = require('express');
const app = express();
const router = require('./router');

const path = require('path');
const bodyParser = require('body-parser');
const { checkAuth } = require('./authController');
const {
  happyHourParams,
  socialMediaParams,
  patchSocialMedia
} = require('./serverMiddleware');
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const db = require('knex')(configuration);

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.use(bodyParser.json());

app.use('/api', router);

app.set('secretKey', process.env.SECRET_KEY);

// All remaining requests return the React app, so it can handle routing.
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

//----> STATUS_TYPE <----//
app.route('/api/v1/statustype/update/').put(checkAuth, (req, res) => {
  const id = req.headers.businessID;
  const newStatus = req.body;

  for (let requiredParams of ['type']) {
    if (!newStatus[requiredParams]) {
      return res.status(422).json({
        error: `Missing required parameter ${requiredParams}`
      });
    }
  }

  db('status_type')
    .where('id', id)
    .update(newStatus)
    .then(statusID => {
      db('locations')
        .where('id', id)
        .select('*')
        .then(updatedLocation => {
          res.status(200).json({ updatedLocation });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
});

app.get('/api/v1/statustype/:type', (req, res) => {
  const newType = req.params.type;

  db('status_type')
    .where('type', newType)
    .select('id')
    .then(data => res.status(200).json({ data }));
});

app.get('/api/v1/statustype', (req, res) => {
  db('status_type')
    .select('*')
    .then(data => res.status(200).json({ data }));
});

//----> SOCIAL_MEDIA <----//
app
  .route('/api/v1/socialmedia/')
  .get((req, res) => {
    db('social_media')
      .select()
      .then(data => res.status(200).json({ data }))
      .catch(error => res.status(500).json({ error }));
  })
  .patch(checkAuth, patchSocialMedia, (req, res) => {
    const id = req.headers.businessID;
    const newMedia = req.body;

    db('social_media')
      .where('id', id)
      .select(`${newMedia}`)
      .update(newMedia, '*')
      .then(updatedMedia => res.status(200).json({ updatedMedia }))
      .catch(error => res.status(500).json({ error }));
  });

app.route('/api/v1/socialmedia/:type').get(socialMediaParams, (req, res) => {
  const newType = req.params.type;

  db('social_media')
    .select(newType, 'id')
    .then(data => res.status(200).json({ data }))
    .catch(error => res.status(500).json({ error }));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;
