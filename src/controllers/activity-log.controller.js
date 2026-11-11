const catchAsync = require("../utils/catchAsync");
const ActivityService = require("../services/activity-log.service");

const getActivityLogs = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await ActivityService.getUserLogs(req.user._id, { page, limit });

  res.status(200).json({
    success: true,
    message: "Riwayat aktivitas diambil",
    data: result.logs,
    pagination: result.pagination
  });
});

module.exports = { getActivityLogs };
