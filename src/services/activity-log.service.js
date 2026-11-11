const ActivityLogModel = require("../models/activity-log.model");

const createLog = async (userId, action, todoId, changes = {}) => {
  try {
    await ActivityLogModel.create({
      user_id: userId,
      action,
      todo_id: todoId,
      changes
    });
  } catch (err) {
    console.error("Gagal simpan log:", err);
  }
};

const getUserLogs = async (userId, { page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const logs = await ActivityLogModel.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("todo_id", "title");

  const totalItems = await ActivityLogModel.countDocuments({ user_id: userId });

  return {
    logs,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      itemsPerPage: Number(limit)
    }
  };
};

module.exports = { createLog, getUserLogs };