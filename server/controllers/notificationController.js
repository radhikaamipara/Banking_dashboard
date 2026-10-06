const Notification = require('../models/Notification');

// @desc    Get user notifications (direct + broadcast)
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ userId: req.user._id }, { userId: null }],
    })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = notifications.filter(
      (n) => !n.isRead && !n.readBy.includes(req.user._id)
    ).length;

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }

    if (notification.userId) {
      notification.isRead = true;
    } else {
      if (!notification.readBy.includes(req.user._id)) {
        notification.readBy.push(req.user._id);
      }
    }
    await notification.save();

    res.json({ success: true, message: 'Marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    // Mark direct notifications
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

    // For broadcasts, add user to readBy
    const broadcasts = await Notification.find({ userId: null });
    for (const b of broadcasts) {
      if (!b.readBy.includes(req.user._id)) {
        b.readBy.push(req.user._id);
        await b.save();
      }
    }

    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
