const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },

  raw_password: {
    type: String,
  },

  hash_password: {
    type: String,
  },

  posts: [
    {
      title: {
        type: String,
        trim: true,
      },

      content: {
        type: String,
        trim: true,
      },

      date: {
        type: Date,
        default: new Date(),
      },
    },
  ],
});

const User = mongoose.model("Users", UserSchema);
module.exports = User;
