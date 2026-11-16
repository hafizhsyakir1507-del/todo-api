const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, default: "", maxlength: 500 },
  completed: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);
