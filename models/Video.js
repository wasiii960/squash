const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    thumbnail: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    access: {
      type: String,
      required: true,
      default: "FREE",
    },
    status: {
      type: String,
      required: true,
      default: "LIVE",
    },
    link: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema({
        name: {
          type: String,
          required: true,
        },
        role: {
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

const Video = mongoose.model("video", VideoSchema);

exports.Video = Video;
