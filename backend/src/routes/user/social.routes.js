const express = require('express');
const {
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
} = require('../../controllers/user/social.controllers.js');
const { UserIsLoggedIn } = require('../../middlewares/UserAuth.middleware.js');

const router = express.Router();

// Followers routes
router.get('/followers', UserIsLoggedIn, getFollowers);
router.get('/following', UserIsLoggedIn, getFollowing);
router.post('/follow/:userId', UserIsLoggedIn, followUser);
router.delete('/unfollow/:userId', UserIsLoggedIn, unfollowUser);
router.delete('/remove-follower/:userId', UserIsLoggedIn, removeFollower);

// Connections routes
router.get('/connections', UserIsLoggedIn, getConnections);
router.get('/connection-requests', UserIsLoggedIn, getConnectionRequests);
router.post('/connect/:userId', UserIsLoggedIn, sendConnectionRequest);
router.put('/accept-connection/:requestId', UserIsLoggedIn, acceptConnectionRequest);
router.delete('/reject-connection/:requestId', UserIsLoggedIn, rejectConnectionRequest);
router.delete('/remove-connection/:userId', UserIsLoggedIn, removeConnection);

module.exports = router;
