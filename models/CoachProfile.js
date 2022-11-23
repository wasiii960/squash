const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
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
    },
    dob: {
      type: Date,
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
    qualifications: [
      {
        type: String,
        required: true,
      },
    ],
    email: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    facebook: {
      type: String,
    },
    creadit: {
      type: Number,
      required: true,
      default: 0,
    },
    awards: [
      {
        type: String,
        required: true,
      },
    ],
    clubs: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const CoachProfile = mongoose.model("CoachProfile", ProfileSchema);

exports.CoachProfile = CoachProfile;
