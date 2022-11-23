const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "PLAYER",
  },
  status: {
    type: String,
    required: true,
    default: "ACTIVE",
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.id, role: this.role },
    config.get("jwtPrivateKey"),
    { expiresIn: 3600000 }
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

exports.User = User;
