const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  cover: {
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
  type: {
    type: String,
    required: true,
    default: "ARTICLE",
  },
  file: {
    type: String,
    required: true,
  },
  coach: {
    type: mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
});

const Document = mongoose.model("document", DocumentSchema);

exports.Document = Document;
