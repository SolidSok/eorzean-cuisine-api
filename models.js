const mongoose = require('mongoose');

let foodSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  region: { trype: String },
});

let locationSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

let Food = mongoose.model('Food', foodSchema);
let Location = mongoose.model('Location', locationSchema);

module.exports.Food = Food;
module.exports.Location = Location;
