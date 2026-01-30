const userModel = require("../../models/user.model");

const getInvites = async (req, res) => {
  try {
    const user = req.user;
    
    // Get connection requests received
    const connectionRequestsReceived = await userModel.find({
      _id: { $in: user.connectionRequestsReceived || [] }
    }).select('username profilePic headline').lean();
    
    // Get project invites (if any)
    const projectInvites = await userModel.aggregate([
      { $unwind: '$projectInvites' },
      { $match: { 'projectInvites.userId': user._id } },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectInvites.projectId',
          foreignField: '_id',
          as: 'projectDetails'
        }
      },
      { $unwind: '$projectDetails' },
      {
        $project: {
          projectName: '$projectDetails.name',
          projectId: '$projectDetails._id',
          invitedBy: '$projectInvites.invitedBy',
          message: '$projectInvites.message',
          createdAt: '$projectInvites.createdAt'
        }
      }
    ]);
    
    return res.status(200).json({
      message: "Invites fetched successfully",
      invites: {
        connectionRequests: connectionRequestsReceived,
        projectInvites: projectInvites
      }
    });
  } catch (error) {
    console.error("Error fetching invites:", error);
    return res.status(500).json({ message: "Error fetching invites", error });
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { inviteId, type } = req.body;
    const user = req.user;
    
    if (type === 'connection') {
      // Accept connection request
      const requester = await userModel.findById(inviteId);
      if (!requester) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove from requests received
      user.connectionRequestsReceived = user.connectionRequestsReceived.filter(
        id => id.toString() !== inviteId
      );
      
      // Remove from requests sent
      requester.connectionRequestsSent = requester.connectionRequestsSent.filter(
        id => id.toString() !== user._id.toString()
      );
      
      // Add to connections
      user.connections.push(requester._id);
      requester.connections.push(user._id);
      
      await Promise.all([user.save(), requester.save()]);
      
      return res.status(200).json({ message: "Connection request accepted" });
    }
    
    return res.status(400).json({ message: "Invalid invite type" });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return res.status(500).json({ message: "Error accepting invite", error });
  }
};

const rejectInvite = async (req, res) => {
  try {
    const { inviteId, type } = req.body;
    const user = req.user;
    
    if (type === 'connection') {
      // Reject connection request
      const requester = await userModel.findById(inviteId);
      if (!requester) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove from requests received
      user.connectionRequestsReceived = user.connectionRequestsReceived.filter(
        id => id.toString() !== inviteId
      );
      
      // Remove from requests sent
      requester.connectionRequestsSent = requester.connectionRequestsSent.filter(
        id => id.toString() !== user._id.toString()
      );
      
      await Promise.all([user.save(), requester.save()]);
      
      return res.status(200).json({ message: "Connection request rejected" });
    }
    
    return res.status(400).json({ message: "Invalid invite type" });
  } catch (error) {
    console.error("Error rejecting invite:", error);
    return res.status(500).json({ message: "Error rejecting invite", error });
  }
};

module.exports = {
  getInvites,
  acceptInvite,
  rejectInvite
};
