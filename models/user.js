const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.addUser = newUser => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) reject("Error in adding user");
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) reject("Error in adding user");
        else newUser.password = hash;
        User.create(newUser, err => {
          if (err) reject("Sorry, We can not add this user for some reasons");
          else resolve();
        });
      });
    });
  });
};

var comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, isMatch) => {
      if (err) reject("We encountered some error");
      else if (!isMatch) reject("You have typed the wrong password");
      else resolve(isMatch);
    });
  });
};

var getUserByEmail = (email) => {
  return new Promise((resolve,reject) => {
    const query = {
      email: email
    }

    User.findOne(query, (err,user) => {
      if(err) reject("We encountered some error");
      else if(!user) reject("We are unable to find that user");
      else resolve(user);
    })
  })
}

module.exports.authenticate = (email, password) => {
  return new Promise((resolve, reject) => {
    getUserByEmail(email)
      .then(user => {
        comparePassword(password, user.password)
          .then(() => {
            resolve(user);
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });
};
