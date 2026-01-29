const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true }, // Rich text content
    title: String, // Optional headline
    media: [{
      type: { type: String, enum: ["image", "video", "document"], default: "image" },
      url: String,
      fileId: String,
      thumbnail: String, // For videos
      metadata: {
        width: Number,
        height: Number,
        size: Number,
        format: String
      }
    }],
    hashtags: [{ type: String, lowercase: true, trim: true }],
    mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    visibility: { 
      type: String, 
      enum: ["public", "connections", "private"], 
      default: "public" 
    },
    engagement: {
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
      shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      viewEvents: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        timestamp: { type: Date, default: Date.now }
      }]
    },
    poll: {
      question: String,
      options: [{
        text: String,
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        _id: false
      }],
      expiresAt: Date,
      allowMultipleChoice: { type: Boolean, default: false }
    },
    article: {
      title: String,
      content: String, // Full article content
      coverImage: String,
      readTime: Number, // in minutes
      isPublished: { type: Boolean, default: true }
    },
    linkPreview: {
      url: String,
      title: String,
      description: String,
      image: String,
      siteName: String
    },
    isPinned: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    tags: [{ type: String, lowercase: true, trim: true }], // Professional tags
    industry: { type: String, lowercase: true, trim: true },
    location: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastActivityAt: { type: Date, default: Date.now }
  },
  {
    toJSON: { virtuals: true },
    timestamps: true
  }
);

// Virtuals for better API responses
postSchema.virtual("likeCount").get(function() {
  return this.engagement?.likes?.length || 0;
});

postSchema.virtual("commentCount").get(function() {
  return this.engagement?.comments?.length || 0;
});

postSchema.virtual("shareCount").get(function() {
  return this.engagement?.shares?.length || 0;
});

postSchema.virtual("hasMedia").get(function() {
  return this.media && this.media.length > 0;
});

postSchema.virtual("hasPoll").get(function() {
  return this.poll && this.poll.question && this.poll.options?.length > 0;
});

postSchema.virtual("hasArticle").get(function() {
  return this.article && this.article.title && this.article.content;
});

// Indexes for better performance
postSchema.index({ createdBy: 1, createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ mentions: 1 });
postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ "engagement.likes": 1 });
postSchema.index({ isPinned: 1, createdAt: -1 });

const postModel = mongoose.model("post", postSchema);

module.exports = postModel;
