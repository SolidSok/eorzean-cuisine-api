const mongoose = require('mongoose');

let foodSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  region: { type: String },
});

let locationsSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

let usersSchema = mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  favoriteFood: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
});

let Food = mongoose.model('Food', foodSchema);
let Locations = mongoose.model('Location', locationsSchema);
let Users = mongoose.model('Users', usersSchema);

module.exports.Food = Food;
module.exports.Locations = Locations;
module.exports.Users = Users;
