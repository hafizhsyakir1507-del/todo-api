const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: [true, "Nama kategori wajib diisi"], trim: true, maxlength: 80 },
  description: { type: String, default: "", maxlength: 300 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
