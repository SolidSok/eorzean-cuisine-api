const bodyParser = require('body-parser'),
  express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'),
  path = require('path'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  { check, validationResult } = require('express-validator');

const Food = Models.Food;

mongoose.connect('mongodb://localhost27017/eorzeanCuisine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:4200',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        let message =
          'The CORS policy for this application does not allow access from origin. ' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// ----- Routes ----- //

app.get('./documentation', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname });
});

app.get('/', (req, res) => {
  res.send('Welcome!');
});

// get food
app.get('/menu', (req, res) => {
  Food.find()
    .then(food => {
      res.status(201).json(food);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
