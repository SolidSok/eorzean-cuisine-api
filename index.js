const bodyParser = require('body-parser');
const express = require('express');
const crypto = require('crypto');
const assignID = crypto.randomUUID();

const app = express();
const mongoose = require('mongoose');
// const Models = require('./models.js');

// const food = Models.food;
// const Locations = Models.Locations;
// const Users = Models.Users;

app.use(express.json());
app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost27017/eorzeanCuisine', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// ----- Routes ----- //

app.get('/', (req, res) => {
  res.send('Welcome!');
});

// ----- delete this later ------------------
let users = [
  {
    id: 1,
    name: 'Amy',
    favoritefood: ['Pasta'],
  },
  {
    id: 2,
    name: 'Bob',
    favoritefood: [],
  },
  {
    id: 3,
    name: 'Cessei',
    favoritefood: ['pizza', 'chow-mein'],
  },
];

let food = [
  {
    name: 'pizza',
    description: 'yummy',
    type: 'meal',
    ingredient: 'item1',
  },
  {
    name: 'pasta',
    description: 'yummy',
    type: 'meal',
    ingredient: ['item3', 'item4'],
  },
  {
    name: 'bread',
    description: 'yummy',
    type: 'meal',
    ingredient: ['item1', 'item2'],
  },
  {
    name: 'drink',
    description: 'sweet',
    type: 'drink',
    ingredient: ['item3', 'item5'],
  },
];

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = assignID;
    res.status(201).json(newUser);
  } else {
    res.status(400).send('user needs name');
  }
});

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;

  let user = users.find(user => user.id == id);

  if (user) {
    user.name = updatedUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send('no such user');
  }
});

// DELETE remove users
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);
  if (user) {
    users = users.filter(user => user.id != id);
    res.status(200).send(`user ${id} has been deleted`);
  } else {
    res.status(400).send('no such user');
  }
});

// CREATE add food to user arrays
app.post('/users/:id/:foodName', (req, res) => {
  const { id, foodName } = req.params;

  let user = users.find(user => user.id == id);
  if (user) {
    user.favoritefood.push(foodName);
    res.status(200).send(`${foodName} has been added to user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

// DELETE remove food from users' arrays
app.delete('/users/:id/:foodName', (req, res) => {
  const { id, foodName } = req.params;

  let user = users.find(user => user.id == id);
  if (user) {
    user.favoritefood.filter(name => name !== foodName);
    res
      .status(200)
      .send(`${foodName} has been removed from user ${id}'s array`);
  } else {
    res.status(400).send('no such user');
  }
});

app.get('/food', (req, res) => {
  res.status(200).json(food);
});

// READ food by name
app.get('/food/:name', (req, res) => {
  const { name } = req.params;
  const foodItem = food.find(foodItem => foodItem.name === name);

  if (foodItem) {
    res.status(200).json(foodItem);
  } else {
    res.status(400).send('no such foodItem');
  }
});

// READ food by ingredient
app.get('/food/ingredient/:ingredientName', (req, res) => {
  const { ingredientName } = req.params;
  const ingredient = food.find(food => food.ingredient === ingredientName);

  if (ingredient) {
    res.status(200).json(ingredient);
  } else {
    res.status(400).send('no such ingredient');
  }
});

// ---------------------------- delete above -------------

// get food
// app.get('/food', (req, res) => {
//   food.find()
//     .then(food => {
//       res.status(201).json(food);
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });

// app.get('/users', (req, res) => {
//   Users.find();
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
