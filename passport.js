const passport = require('passport'),
  localStrategy = require('passport-local').Strategy;
(Models = require('./models.js')), (passPortJWT = require('passport-jwt'));

let Users = Models.User,
  JWTStrategy = passPortJWT.Strategy,
  ExtractJWT = passPortJWT.ExtractJWT;

passport.use(
  new LocalStrategy(
    {
      userNameField: 'userName',
      passwordField: 'password',
    },
    (username, password, callback) => {
      console.log(username + ' ' + password);
      Users.findOne({ userName: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }

        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

passport.user(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    (jwtPayLoad, callback) => {
      return Users.findById(jwtPayLoad._id)
        .then(user => {
          return callback(null, user);
        })
        .catch(err => {
          return callback(err);
        });
    }
  )
);
