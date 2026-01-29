const UserModel = require("../models/user.model");
const TaskModel = require("../models/task.model");
const projectModel = require("../models/project.model");

// Enhanced notification schema for better structure
const createNotification = async (userId, notificationData) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) return false;

    const notification = {
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      fromUser: notificationData.fromUser,
      relatedId: notificationData.relatedId,
      relatedType: notificationData.relatedType,
      actionUrl: notificationData.actionUrl,
      isRead: false,
      createdAt: new Date()
    };

    user.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (user.notifications.length > 50) {
      user.notifications = user.notifications.slice(0, 50);
    }
    
    await user.save();
    return true;
  } catch (error) {
    console.error("Failed to create notification:", error);
    return false;
  }
};

// Get all notifications for a user
const getNotifications = async (req, res) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    let notifications = user.notifications || [];
    
    if (unreadOnly === 'true') {
      notifications = notifications.filter(n => !n.isRead);
    }
    
    // Sort by creation date (newest first)
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedNotifications = notifications.slice(startIndex, endIndex);
    
    // Populate fromUser details
    const populatedNotifications = await Promise.all(
      paginatedNotifications.map(async (notification) => {
        if (notification.fromUser) {
          const fromUser = await UserModel.findById(notification.fromUser)
            .select('username profilePic headline');
          return {
            ...notification.toObject(),
            fromUser
          };
        }
        return notification;
      })
    );
    
    res.status(200).json({
      notifications: populatedNotifications,
      unreadCount: user.notifications.filter(n => !n.isRead).length,
      totalCount: user.notifications.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(notifications.length / limit)
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user = req.user;
    
    const notification = user.notifications.id(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    notification.isRead = true;
    await user.save();
    
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark notification as read", error });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const user = req.user;
    
    user.notifications.forEach(notification => {
      notification.isRead = true;
    });
    
    await user.save();
    
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({ message: "Failed to mark all notifications as read", error });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const user = req.user;
    
    user.notifications = user.notifications.filter(
      n => n._id.toString() !== notificationId
    );
    
    await user.save();
    
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification", error });
  }
};

// Get unread count
const getUnreadCount = async (req, res) => {
  try {
    const user = req.user;
    const unreadCount = user.notifications.filter(n => !n.isRead).length;
    
    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({ message: "Failed to get unread count", error });
  }
};

// Helper function to create different types of notifications
const NotificationTypes = {
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_STATUS_CHANGED: 'task_status_changed',
  PROJECT_INVITATION: 'project_invitation',
  PROJECT_JOINED: 'project_joined',
  PROFILE_VIEW: 'profile_view',
  SKILL_ENDORSEMENT: 'skill_endorsement'
};

// Create connection request notification
const createConnectionRequestNotification = async (fromUserId, toUserId) => {
  return await createNotification(toUserId, {
    type: NotificationTypes.CONNECTION_REQUEST,
    title: "New Connection Request",
    message: "wants to connect with you",
    fromUser: fromUserId,
    relatedId: fromUserId,
    relatedType: 'user',
    actionUrl: `/profile/${fromUserId}`
  });
};

// Create connection accepted notification
const createConnectionAcceptedNotification = async (fromUserId, toUserId) => {
  return await createNotification(toUserId, {
    type: NotificationTypes.CONNECTION_ACCEPTED,
    title: "Connection Accepted",
    message: "accepted your connection request",
    fromUser: fromUserId,
    relatedId: fromUserId,
    relatedType: 'user',
    actionUrl: `/profile/${fromUserId}`
  });
};

// Create task notification
const createTaskNotification = async (userId, task, type, message) => {
  return await createNotification(userId, {
    type,
    title: `Task ${type}`,
    message,
    fromUser: task.assignedTo,
    relatedId: task._id,
    relatedType: 'task',
    actionUrl: `/projects/${task.project}/tasks/${task._id}`
  });
};

// Create project invitation notification
const createProjectInvitationNotification = async (userId, project, inviterId) => {
  return await createNotification(userId, {
    type: NotificationTypes.PROJECT_INVITATION,
    title: "Project Invitation",
    message: `invited you to join project "${project.title}"`,
    fromUser: inviterId,
    relatedId: project._id,
    relatedType: 'project',
    actionUrl: `/projects/${project._id}`
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createNotification,
  NotificationTypes,
  createConnectionRequestNotification,
  createConnectionAcceptedNotification,
  createTaskNotification,
  createProjectInvitationNotification
};
