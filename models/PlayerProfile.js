const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  height: {
    type: String,
  },
  playingHand: {
    type: String,
  },
  experience: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  gear: {
    type: new mongoose.Schema(
      {
        name: {
          type: String,
          required: true,
        },
      },
      { _id: false }
    ),
  },
});

const PlayerProfile = mongoose.model("PlayerProfile", ProfileSchema);

exports.PlayerProfile = PlayerProfile;
