const Category = require("../models/category.model");
const Todo = require("../models/todo.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const createCategory = catchAsync(async (req, res) => {
  const { name, description = "" } = req.body;
  const category = await Category.create({ name, description, user: req.user._id, created_by: req.user._id, updated_by: req.user._id });
  res.status(201).json({ success: true, message: "Kategori berhasil dibuat", data: category });
});

const getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({ user: req.user._id, archived: false }).sort("-createdAt");
  res.status(200).json({ success: true, data: categories });
});

const getCategoryById = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id, archived: false });
  if (!category) return next(new AppError("Kategori tidak ditemukan", 404));
  res.status(200).json({ success: true, data: category });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const allowed = {};
  if (req.body.name !== undefined) allowed.name = req.body.name;
  if (req.body.description !== undefined) allowed.description = req.body.description;
  allowed.updated_by = req.user._id;
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id, archived: false },
    { $set: allowed }, { new: true, runValidators: true }
  );
  if (!category) return next(new AppError("Kategori tidak ditemukan", 404));
  res.status(200).json({ success: true, message: "Kategori berhasil diperbarui", data: category });
});

const deleteCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findOne({ _id: req.params.id, user: req.user._id, archived: false });
  if (!category) return next(new AppError("Kategori tidak ditemukan", 404));
  // Keep todos intact; removing a category simply makes those todos uncategorized.
  await Todo.updateMany({ category: category._id, owner: req.user._id }, { $set: { category: null, updated_by: req.user._id } });
  category.archived = true;
  category.updated_by = req.user._id;
  await category.save();
  res.status(200).json({ success: true, message: "Kategori berhasil diarsipkan" });
});

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
