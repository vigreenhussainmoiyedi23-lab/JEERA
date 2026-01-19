const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,

    profilePic: {
      url: { type: String, default: "" },
      fileId: { type: String, default: "" }
    },
    profileBanner: {
      url: { type: String, default: "" },
      fileId: { type: String, default: "" }
    },

    bio: String,
    skills: [],

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    projects: [
      {
        project: { type: mongoose.Schema.Types.ObjectId, ref: "project" },
        status: { type: String, default: "member" }
      }
    ],
    tasks: [
      {
        task: { type: mongoose.Schema.Types.ObjectId, ref: "task" },
        project: { type: mongoose.Schema.Types.ObjectId, ref: "project" }
      }
    ],
    invites: [{ type: mongoose.Schema.Types.ObjectId, ref: "project" }],

    googleId: String,
    authProvider: {
      type: String,
      enum: ["custom", "google"],
      default: "custom",
    },
    isVerified: { type: Boolean, default: false },

    /* ============================= */
    /* 🔽 LINKEDIN-STYLE ADDITIONS 🔽 */
    /* ============================= */

    headline: {
      type: String,
      default: "", // e.g. "Frontend Developer | React | Tailwind"
    },

    location: {
      city: String,
      country: String,
    },

    experience: [
      {
        role: String,
        company: String,
        description: String,
        startDate: Date,
        endDate: Date, // null if current
        isCurrent: { type: Boolean, default: false },
      }
    ],

    education: [
      {
        school: String,
        degree: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      }
    ],

    certifications: [
      {
        name: String,
        organization: String,
        issueDate: Date,
        credentialUrl: String,
      }
    ],

    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },

    openToWork: {
      type: Boolean,
      default: false,
    },

    profileVisibility: {
      type: String,
      enum: ["public", "connections", "private"],
      default: "public",
    },

  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
