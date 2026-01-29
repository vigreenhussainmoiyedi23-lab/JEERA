const express = require("express");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require("../controllers/notification.controllers");
const { UserIsLoggedIn } = require("../middlewares/UserAuth.middleware");

const Router = express.Router();

// Apply auth middleware to all routes
Router.use(UserIsLoggedIn);

// Get all notifications with pagination
Router.get("/", getNotifications);

// Get unread count
Router.get("/unread-count", getUnreadCount);

// Mark notification as read
Router.patch("/:notificationId/read", markAsRead);

// Mark all notifications as read
Router.patch("/read-all", markAllAsRead);

// Delete notification
Router.delete("/:notificationId", deleteNotification);

module.exports = Router;
