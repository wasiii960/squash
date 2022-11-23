const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    timePeriod: {
      type: Number,
      required: true,
    },
    totalFee: {
      type: Number,
      required: true,
    },
    coachShare: {
      type: Number,
    },
    status: {
      type: String,
      required: true,
      default: "UNAPPROVED",
    },
    numberSold: {
      type: Number,
      default: 0,
    },
    currentRating: {
      type: Number,
      default: 0,
    },
    noOfRatings: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        commentor: {
          type: String,
          required: true,
        },
        time: {
          type: Date,
          required: true,
        },
      },
    ],
    videos: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        thumbnail: {
          type: String,
          required: true,
        },
      },
    ],
    coach: {
      type: mongoose.Schema({
        name: {
          type: String,
          required: true,
        },
      }),
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Subscriptions", PackageSchema);

exports.Package = Package;
