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
    // Social features
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    connectionRequests: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    notifications: [
      {
        type: String,
        title: String,
        message: String,
        fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        relatedId: { type: mongoose.Schema.Types.ObjectId },
        relatedType: String, // 'user', 'task', 'project', 'post'
        actionUrl: String,
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ],
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

    pronouns: {
      type: String,
      default: "",
    },

    location: {
      city: String,
      country: String,
    },

    contactInfo: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    // the thing is if the array's length is 0 dont show the section yet 
    experience: [
      {
        title: String,
        company: String,
        employmentType: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        location: String,
        description: String,
        companyWebsite: String
      }
    ],

    education: [
      {
        degree: String,
        school: String,
        field: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        location: String,
        description: String
      }
    ],

    profileProjects: [
      {
        title: String,
        description: String,
        image: String,
        url: String,
        githubUrl: String,
        technologies: [String],
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false }
      }
    ],

    certifications: [
      {
        name: String,
        organization: String,
        issuer: String,
        issueDate: String,
        expirationDate: String,
        credentialId: String,
        credentialUrl: String,
        doesNotExpire: { type: Boolean, default: false }
      }
    ],

    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    // also now update there is a reason that both of this may happen
    openToWork: {
      type: Boolean,
      default: false,
    },
    openToHiring: {
      type: Boolean,
      default: false,
    },
    // also show at frontend that how many followers and connections he has and make him able to remove followers or unfollow others or remove connections or requests

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    connectionRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    connectionRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    skillImage: {
      url: { type: String, default: "" },
      fileId: { type: String, default: "" }
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
