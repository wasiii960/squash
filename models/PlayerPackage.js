const mongoose = require("mongoose");

const PlayerPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  packages: [
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
      cost: {
        type: Number,
        required: true,
      },
      timePeriod: {
        type: Number,
        required: true,
      },
      startDate: {
        type: Date,
        required: true,
        default: Date.now(),
      },
      rated: {
        type: Boolean,
        required: true,
        default: false,
      },
      playerStatsFile: {
        type: String,
      },
      coach: {
        type: mongoose.Schema({
          name: {
            type: String,
            required: true,
          },
        }),
      },
      playerVideos: [
        {
          type: new mongoose.Schema({
            createdAt: {
              type: Date,
              default: Date.now(),
              required: true,
            },
            title: {
              type: String,
              required: true,
            },
            desc: {
              type: String,
            },
            video: {
              type: String,
              required: true,
            },
          }),
        },
      ],
    },
  ],
});

const PlayerPackage = mongoose.model("PlayerPackage", PlayerPackageSchema);

exports.PlayerPackage = PlayerPackage;
