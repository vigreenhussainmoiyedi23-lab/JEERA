const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    title: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    thumbnail: [{
      url: String,
      fileId: String
    }],
    images: [{ url: String, fileId: String }]
  },
  {
    toJSON: { virtuals: true }, // 👈 important
  }
);
const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
