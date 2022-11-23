const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const NewsFeed = mongoose.model("news feed", FeedSchema);

exports.NewsFeed = NewsFeed;
