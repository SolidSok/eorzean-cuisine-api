const bodyParser = require('body-parser');

const express = require('express');

const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Food = Models.Food;
const Locations = Models.Locations;
const Users = Models.Users;

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect('mongodb://127.0.0.1:27017/EorzeanCuisine', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
let allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:1234',
  'http://localhost:3000',
  'https://eorzean-cuisine-client.herokuapp.com',
];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         let message =
//           'The CORS policy for this application doesn’t allow access from origin ' +
//           origin;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );
app.use(
  cors({
    origin: 'https://eorzean-cuisine-solidsok.vercel.app/',
    methods: ['GET'],
  })
);

let auth = require('./auth')(app);
const passport = require('passport');
const { check, validationResult } = require('express-validator');
require('./passport');

// ----- Routes ----- //

app.get('/', (req, res) => {
  res.send('Welcome!');
});
// ------------ Users -------------------- //
// get list of users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then(users => {
        res.status(201).json(users);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);
// get one user by Username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// create new user
app.post(
  '/users',
  [
    check(
      'Username',
      'Username is required with at least 5 characters'
    ).isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
  ],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }).then(user => {
      if (user) {
        return res.status(400).send(req.body.Username + ' is already a user.');
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          email: req.body.email,
          birthday: req.body.birthday,
        })
          .then(user => {
            res.status(201).json(user);
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          });
      }
    });
  }
);

//update user
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          favoriteFood: req.body.favoriteFood,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete a user by name
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then(user => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// CREATE add food to favorites
app.post(
  '/users/:Username/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { favoriteFood: req.params.id },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// DELETE remove food from users' favorites
app.delete(
  '/users/:id/:foodName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id, foodName } = req.params;

    let user = Users.find(user => user.id == id);
    if (user) {
      user.favoriteFood.filter(name => name !== foodName);
      res
        .status(200)
        .send(`${foodName} has been removed from user ${id}'s array`);
    } else {
      res.status(400).send('no such user');
    }
  }
);
// ------------ /Users -------------------- //

// ------------ Food -------------------- //

app.get('/food', (req, res) => {
  Food.find()
    .then(food => {
      res.status(201).json(food);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// READ food by name
app.get('/food/:name', (req, res) => {
  Food.findOne({ name: req.params.name })
    .then(food => {
      res.json(food);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// READ food by type
app.get('/food/type/:type', (req, res) => {
  Food.find({ type: req.params.type })
    .then(food => {
      res.json(food);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});

// read food by region
app.get('/food/region/:region', (req, res) => {
  Food.find({ region: req.params.region })
    .then(food => res.json(food))
    .catch(err => {
      console.error(err);
      res.status(500).send('Error ' + err);
    });
});
// ------------ /Food -------------------- //

// ------------ Locations -------------------- //

// ------------ /Locations -------------------- //

// get location data
app.get('/locations', (req, res) => {
  Locations.find()
    .then(locations => {
      res.status(201).json(locations);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// testing for adding food, do not use in actual product
// app.post('/food', (req, res) => {
//   Food.findOne({ name: req.body.name })
//     .then(food => {
//       if (food) {
//         return res.status(400).send('already food');
//       } else {
//         Food.create({
//           name: req.body.name,
//           description: req.body.description,
//           type: req.body.type,
//           region: req.body.region,
//         });
//       }
//     })
//     .then(food => {
//       res.status(201).json(food);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });

// app.post('/users', (req, res) => {
//   let newUser = req.body;

//   if (!newUser.name) {
//     const message = 'missing "name" in request body';
//     res.status(400).send(message);
//   } else {
//     newUser.id = crypto.randomUUID();
//   }
// });

app.get('./documentation', (req, res) => {
  res.sendFile('/public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));

// error handling goes last but before app.listen
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//App listen with changing port
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Your app is listening on port 8080.');
});
