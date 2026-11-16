const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    enum: ["create", "update", "delete"],
    required: true
  },
  todo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Todo",
    required: true
  },
  changes: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
