const userModel = require("../../models/user.model");
const {
  createConnectionRequestNotification,
  createConnectionAcceptedNotification
} = require("../notification.controllers");

const sanitizeUser = (u) => {
  if (!u) return u;
  const obj = u.toObject ? u.toObject() : { ...u };
  obj.password = null;
  return obj;
};

const ProfileIndexHandler = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id)
      .select(
        "username email profilePic profileBanner bio skills headline pronouns location education experience certifications profileProjects socialLinks contactInfo openToWork followers following connections connectionRequestsSent connectionRequestsReceived"
      );
    return res.status(200).json({ message: "User Profile Data", user: sanitizeUser(user) });
  } catch (error) {
    return res.status(500).json({ message: "Error Fetching User Profile Data", error });
  }
};

const UpdateHandler = async (req, res) => {
  const user = req.user;
  try {
    const {
      username,
      bio,
      skills,
      headline,
      pronouns,
      openToWork,
      location,
      education,
      experience,
      certifications,
      profileProjects,
      socialLinks,
      contactInfo,
      profileVisibility,
    } = req.body;

    if (typeof username === "string") user.username = username;
    if (typeof bio === "string") user.bio = bio;
    if (Array.isArray(skills)) user.skills = skills;
    if (typeof headline === "string") user.headline = headline;
    if (typeof pronouns === "string") user.pronouns = pronouns;
    if (typeof openToWork === "boolean") user.openToWork = openToWork;

    if (location && typeof location === "object") {
      user.location = {
        city: typeof location.city === "string" ? location.city : user.location?.city,
        country:
          typeof location.country === "string" ? location.country : user.location?.country,
      };
    }

    if (Array.isArray(education)) user.education = education;
    if (Array.isArray(experience)) user.experience = experience;
    if (Array.isArray(certifications)) user.certifications = certifications;
    if (Array.isArray(profileProjects)) user.profileProjects = profileProjects;
    if (socialLinks && typeof socialLinks === "object") {
      user.socialLinks = {
        ...(user.socialLinks?.toObject?.() || {}),
        ...socialLinks,
      };
    }

    if (contactInfo && typeof contactInfo === "object") {
      user.contactInfo = {
        ...(user.contactInfo?.toObject?.() || {}),
        ...contactInfo,
      };
    }

    if (typeof profileVisibility === "string") user.profileVisibility = profileVisibility;

    await user.save();
    return res.status(200).json({ message: "Profile updated", user: sanitizeUser(user) });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Error updating profile", error });
  }
};

const ProfileByIdHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const target = await userModel.findById(userId)
      .select(
        "username email profilePic profileBanner bio skills headline pronouns location education experience certifications profileProjects socialLinks contactInfo openToWork followers following connections connectionRequestsSent connectionRequestsReceived"
      );
    if (!target) return res.status(404).json({ message: "User not found" });

    const viewer = req.user;
    const isFollowing = (viewer.following || []).some((id) => id.toString() === userId.toString());
    const isConnected = (viewer.connections || []).some((id) => id.toString() === userId.toString());
    const requestSent = (viewer.connectionRequestsSent || []).some(
      (id) => id.toString() === userId.toString(),
    );
    const requestReceived = (viewer.connectionRequestsReceived || []).some(
      (id) => id.toString() === userId.toString(),
    );

    return res.status(200).json({
      message: "User Profile Data",
      user: sanitizeUser(target),
      relationship: {
        isFollowing,
        isConnected,
        requestSent,
        requestReceived,
        followersCount: target.followers?.length || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user profile", error });
  }
};

const ToggleFollowHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const target = await userModel.findById(userId);
    if (!target) return res.status(404).json({ message: "User not found" });

    const viewer = await userModel.findById(req.user._id);
    const already = (viewer.following || []).some((id) => id.toString() === userId.toString());

    if (already) {
      viewer.following = (viewer.following || []).filter((id) => id.toString() !== userId.toString());
      target.followers = (target.followers || []).filter((id) => id.toString() !== viewer._id.toString());
    } else {
      viewer.following = [...(viewer.following || []), target._id];
      target.followers = [...(target.followers || []), viewer._id];
    }

    await Promise.all([viewer.save(), target.save()]);
    return res.status(200).json({
      message: already ? "Unfollowed" : "Followed",
      isFollowing: !already,
      followersCount: target.followers?.length || 0,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error toggling follow", error });
  }
};

const ToggleConnectHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot connect with yourself" });
    }

    const target = await userModel.findById(userId);
    if (!target) return res.status(404).json({ message: "User not found" });

    const viewer = await userModel.findById(req.user._id);

    const isConnected = (viewer.connections || []).some((id) => id.toString() === userId.toString());
    if (isConnected) {
      return res.status(200).json({
        message: "Already connected",
        isConnected: true,
        requestSent: false,
        requestReceived: false,
      });
    }

    const targetRequestedViewer = (target.connectionRequestsSent || []).some(
      (id) => id.toString() === viewer._id.toString(),
    );

    // If target already requested viewer, accept immediately
    if (targetRequestedViewer) {
      viewer.connectionRequestsReceived = (viewer.connectionRequestsReceived || []).filter(
        (id) => id.toString() !== userId.toString(),
      );
      target.connectionRequestsSent = (target.connectionRequestsSent || []).filter(
        (id) => id.toString() !== viewer._id.toString(),
      );

      viewer.connections = [...(viewer.connections || []), target._id];
      target.connections = [...(target.connections || []), viewer._id];

      await Promise.all([viewer.save(), target.save()]);
      await createConnectionAcceptedNotification(viewer._id, target._id);
      await createConnectionAcceptedNotification(target._id, viewer._id);
      return res.status(200).json({ message: "Connection accepted", isConnected: true });
    }

    const alreadySent = (viewer.connectionRequestsSent || []).some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadySent) {
      viewer.connectionRequestsSent = (viewer.connectionRequestsSent || []).filter(
        (id) => id.toString() !== userId.toString(),
      );
      target.connectionRequestsReceived = (target.connectionRequestsReceived || []).filter(
        (id) => id.toString() !== viewer._id.toString(),
      );
      await Promise.all([viewer.save(), target.save()]);
      return res.status(200).json({ message: "Connection request cancelled", requestSent: false });
    }

    viewer.connectionRequestsSent = [...(viewer.connectionRequestsSent || []), target._id];
    target.connectionRequestsReceived = [...(target.connectionRequestsReceived || []), viewer._id];
    await Promise.all([viewer.save(), target.save()]);
    await createConnectionRequestNotification(viewer._id, target._id);
    return res.status(200).json({ message: "Connection request sent", requestSent: true });
  } catch (error) {
    return res.status(500).json({ message: "Error sending connection request", error });
  }
};

const RejectConnectionRequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user._id.toString() === userId.toString()) {
      return res.status(400).json({ message: "Cannot reject your own request" });
    }

    const target = await userModel.findById(userId);
    if (!target) return res.status(404).json({ message: "User not found" });

    const viewer = await userModel.findById(req.user._id);

    // Check if target sent a request to viewer
    const targetRequestedViewer = (viewer.connectionRequestsReceived || []).some(
      (id) => id.toString() === userId.toString(),
    );

    if (targetRequestedViewer) {
      // Remove the request from both sides
      viewer.connectionRequestsReceived = (viewer.connectionRequestsReceived || []).filter(
        (id) => id.toString() !== userId.toString(),
      );
      target.connectionRequestsSent = (target.connectionRequestsSent || []).filter(
        (id) => id.toString() !== viewer._id.toString(),
      );

      await Promise.all([viewer.save(), target.save()]);
      return res.status(200).json({ 
        message: "Connection request rejected", 
        requestReceived: false,
        isConnected: false 
      });
    }

    return res.status(400).json({ message: "No connection request to reject" });
  } catch (error) {
    return res.status(500).json({ message: "Error rejecting connection request", error });
  }
};

const SearchUsersHandler = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 2) {
      return res.status(400).json({ message: "Search username must be at least 2 characters" });
    }
    
    const searchUsername = username.trim();

    // Search users by username (case-insensitive)
    const users = await userModel
      .find({
        username: { $regex: searchUsername, $options: 'i' }
      })
      .select('username profilePic headline followersCount')
      .limit(10)
      .lean();
    
    return res.status(200).json({
      message: "Users found successfully",
      users: users.map(user => ({
        ...user,
        followersCount: user.followersCount || 0
      }))
    });
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ message: "Error searching users", error });
  }
};

module.exports = {
  ProfileIndexHandler,
  UpdateHandler,
  ProfileByIdHandler,
  ToggleFollowHandler,
  ToggleConnectHandler,
  RejectConnectionRequestHandler,
  SearchUsersHandler,
};