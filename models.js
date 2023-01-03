const mongoose = require('mongoose');

let foodSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  region: { type: String },
  price: { type: String },
});

let locationSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String },
  favoriteFood: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
});

userSchema.statics.hashPassword = password => {
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let Food = mongoose.model('Food', foodSchema);
let Locations = mongoose.model('Location', locationSchema);
let Users = mongoose.model('Users', userSchema);

module.exports.Food = Food;
module.exports.Locations = Locations;
module.exports.Users = Users;
