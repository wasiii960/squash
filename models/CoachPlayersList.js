const mongoose = require("mongoose");

const PlayerListSchema = new mongoose.Schema({
  coach: {
    type: mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
    }),
  },
  requests: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
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
        default: "PENDING",
      },
      PaymentStatus: {
        type: String,
        required: true,
        default: "UNPAID",
      },
      packageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      packageName: {
        type: String,
        required: true,
      },
      packageCost: {
        type: Number,
        required: true,
      },
      totalTimePeriod: {
        type: Number,
        required: true,
      },
      PackageStartDate: {
        type: Date,
        required: true,
        default: Date.now(),
      },
    },
  ],
  players: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      img: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      bio: {
        type: String,
        required: true,
      },
      packageName: {
        type: String,
        required: true,
      },
      packageCost: {
        type: Number,
        required: true,
      },
      totalTimePeriod: {
        type: Number,
        required: true,
      },
      PackageStartDate: {
        type: Date,
        required: true,
        default: Date.now(),
      },
      playerStatsFile: {
        type: String,
      },
    },
  ],
});

const PlayerList = mongoose.model("PlayerList", PlayerListSchema);

exports.PlayerList = PlayerList;
