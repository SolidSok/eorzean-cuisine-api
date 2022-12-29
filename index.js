const bodyParser = require('body-parser');
const express = require('express');
const crypto = require('crypto');
const assignID = crypto.randomUUID();

const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');

const Food = Models.Food;
const Locations = Models.Locations;
const Users = Models.Users;

app.use(express.json());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/EorzeanCuisine', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ----- Routes ----- //

app.get('/', (req, res) => {
  res.send('Welcome!');
});

// get list of users
app.get('/users', (req, res) => {
  Users.find()
    .then(users => {
      res.status(201).json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// get one user by userName
app.get('/users/:userName', (req, res) => {
  Users.findOne({ userName: req.params.userName })
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// create new user
app.post('/users', (req, res) => {
  Users.findOne({ userName: req.body.userName }).then(user => {
    if (user) {
      return res.status(400).send(req.body.userName + ' is already a user.');
    } else {
      Users.create({
        userName: req.body.userName,
        password: req.body.password,
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
});

//update user
app.put('/users/:userName', (req, res) => {
  Users.findOneAndUpdate(
    { userName: req.params.userName },
    {
      $set: {
        userName: req.body.userName,
        password: req.body.password,
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
});

// Delete a user by name
app.delete('/users/:userName', (req, res) => {
  Users.findOneAndRemove({ userName: req.params.userName })
    .then(user => {
      if (!user) {
        res.status(400).send(req.params.userName + ' was not found');
      } else {
        res.status(200).send(req.params.userName + ' was deleted.');
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// CREATE add food to favorites
app.post('/users/:userName/:id', (req, res) => {
  Users.findOneAndUpdate(
    { userName: req.params.userName },
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
});

// DELETE remove food from users' favorites
app.delete('/users/:id/:foodName', (req, res) => {
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
});

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

// app.get('/locations');

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
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
