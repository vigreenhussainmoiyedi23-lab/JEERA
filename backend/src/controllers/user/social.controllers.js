const User = require("../../models/user.model.js");

// Get followers of a user
const getFollowers = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .populate('followers', 'username fullName avatar email')
      .select('followers');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Followers fetched successfully',
      data: user.followers
    });
  } catch (error) {
    console.error('Error fetching followers:', error);
    return res.status(500).json({ message: 'Error fetching followers', error });
  }
};

// Get following of a user
const getFollowing = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .populate('following', 'username fullName avatar email')
      .select('following');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Following fetched successfully',
      data: user.following
    });
  } catch (error) {
    console.error('Error fetching following:', error);
    return res.status(500).json({ message: 'Error fetching following', error });
  }
};

// Follow a user
const followUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const [targetUser, currentUser] = await Promise.all([
      User.findById(userId),
      User.findById(currentUserId)
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already following
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following list of current user
    currentUser.following.push(userId);
    
    // Add to followers list of target user
    targetUser.followers.push(currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error following user:', error);
    return res.status(500).json({ message: 'Error following user', error });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const [targetUser, currentUser] = await Promise.all([
      User.findById(userId),
      User.findById(currentUserId)
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following list of current user
    currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
    
    // Remove from followers list of target user
    targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return res.status(500).json({ message: 'Error unfollowing user', error });
  }
};

// Remove a follower
const removeFollower = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const [targetUser, currentUser] = await Promise.all([
      User.findById(userId),
      User.findById(currentUserId)
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from followers list of current user
    currentUser.followers = currentUser.followers.filter(id => id.toString() !== userId);
    
    // Remove from following list of target user
    targetUser.following = targetUser.following.filter(id => id.toString() !== currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({ message: 'Follower removed successfully' });
  } catch (error) {
    console.error('Error removing follower:', error);
    return res.status(500).json({ message: 'Error removing follower', error });
  }
};

// Get connections of a user
const getConnections = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .populate('connections', 'username fullName avatar email')
      .select('connections');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Connections fetched successfully',
      data: user.connections
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return res.status(500).json({ message: 'Error fetching connections', error });
  }
};

// Get connection requests
const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId)
      .populate('connectionRequests.from', 'username fullName avatar email')
      .populate('connectionRequests.to', 'username fullName avatar email')
      .select('connectionRequests');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter requests where user is the recipient
    const receivedRequests = user.connectionRequests.filter(req => 
      req.to.toString() === userId && req.status === 'pending'
    );

    return res.status(200).json({
      message: 'Connection requests fetched successfully',
      data: receivedRequests
    });
  } catch (error) {
    console.error('Error fetching connection requests:', error);
    return res.status(500).json({ message: 'Error fetching connection requests', error });
  }
};

// Send connection request
const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId) {
      return res.status(400).json({ message: 'You cannot send connection request to yourself' });
    }

    const [targetUser, currentUser] = await Promise.all([
      User.findById(userId),
      User.findById(currentUserId)
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already connected
    if (currentUser.connections.includes(userId)) {
      return res.status(400).json({ message: 'Already connected with this user' });
    }

    // Check if request already exists
    const existingRequest = currentUser.connectionRequests.find(req => 
      (req.from.toString() === currentUserId && req.to.toString() === userId) ||
      (req.from.toString() === userId && req.to.toString() === currentUserId)
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Connection request already exists' });
    }

    // Add connection request
    const connectionRequest = {
      from: currentUserId,
      to: userId,
      status: 'pending',
      createdAt: new Date()
    };

    currentUser.connectionRequests.push(connectionRequest);
    await currentUser.save();

    return res.status(200).json({ message: 'Connection request sent successfully' });
  } catch (error) {
    console.error('Error sending connection request:', error);
    return res.status(500).json({ message: 'Error sending connection request', error });
  }
};

// Accept connection request
const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the connection request
    const requestIndex = currentUser.connectionRequests.findIndex(req => 
      req._id.toString() === requestId && 
      req.to.toString() === currentUserId && 
      req.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    const request = currentUser.connectionRequests[requestIndex];
    const fromUserId = request.from;

    // Update request status
    currentUser.connectionRequests[requestIndex].status = 'accepted';

    // Add to connections for both users
    currentUser.connections.push(fromUserId);
    
    const fromUser = await User.findById(fromUserId);
    if (fromUser) {
      fromUser.connections.push(currentUserId);
      fromUser.connectionRequests.push({
        from: currentUserId,
        to: fromUserId,
        status: 'accepted',
        createdAt: new Date()
      });
      await fromUser.save();
    }

    await currentUser.save();

    return res.status(200).json({ message: 'Connection request accepted successfully' });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    return res.status(500).json({ message: 'Error accepting connection request', error });
  }
};

// Reject connection request
const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and remove the connection request
    const requestIndex = currentUser.connectionRequests.findIndex(req => 
      req._id.toString() === requestId && 
      req.to.toString() === currentUserId && 
      req.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Connection request not found' });
    }

    const request = currentUser.connectionRequests[requestIndex];
    const fromUserId = request.from;

    // Remove request from current user
    currentUser.connectionRequests.splice(requestIndex, 1);
    await currentUser.save();

    // Also remove from the sender's requests
    const fromUser = await User.findById(fromUserId);
    if (fromUser) {
      fromUser.connectionRequests = fromUser.connectionRequests.filter(req => 
        !(req.from.toString() === currentUserId && req.to.toString() === fromUserId)
      );
      await fromUser.save();
    }

    return res.status(200).json({ message: 'Connection request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting connection request:', error);
    return res.status(500).json({ message: 'Error rejecting connection request', error });
  }
};

// Remove connection
const removeConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const [targetUser, currentUser] = await Promise.all([
      User.findById(userId),
      User.findById(currentUserId)
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from connections list of current user
    currentUser.connections = currentUser.connections.filter(id => id.toString() !== userId);
    
    // Remove from connections list of target user
    targetUser.connections = targetUser.connections.filter(id => id.toString() !== currentUserId);

    await Promise.all([currentUser.save(), targetUser.save()]);

    return res.status(200).json({ message: 'Connection removed successfully' });
  } catch (error) {
    console.error('Error removing connection:', error);
    return res.status(500).json({ message: 'Error removing connection', error });
  }
};

module.exports = {
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  removeFollower,
  getConnections,
  getConnectionRequests,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection
};
