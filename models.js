const mongoose = require('mongoose');

let foodSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  region: { trype: String },
});

let locationsSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

let usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
});

let Food = mongoose.model('Food', foodSchema);
let Locations = mongoose.model('Location', locationsSchema);
let Users = mongoose.model('Users', usersSchema);

module.exports.Food = Food;
module.exports.Location = Locations;
module.exports.Users = Users;
