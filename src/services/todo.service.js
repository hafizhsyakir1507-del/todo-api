const Todo = require("../models/todo.model");
const Category = require("../models/category.model");
const ActivityLog = require("./activity-log.service");

async function createTodo(data, userId) {
  let categoryId;
  if (data.category) {
    const category = await Category.findOne({ _id: data.category, user: userId, archived: false });
    if (!category) {
      const error = new Error("Kategori tidak ditemukan atau bukan milik pengguna");
      error.statusCode = 400;
      throw error;
    }
    categoryId = category._id;
  }

  const todo = await Todo.create({
    title: data.title,
    description: data.description,
    category: categoryId,
    owner: userId,
    created_by: userId,
    updated_by: userId,
  });

  await ActivityLog.createLog(userId, "create", todo._id, {
    title: todo.title,
    description: todo.description,
    category: todo.category,
  });
  return todo;
}

async function getAllTodos(ownerId, queryOptions = {}) {
  const { page = 1, limit = 10, completed, sortBy = "createdAt", order = "desc", search, category } = queryOptions;
  const filter = { owner: ownerId, archived: false };
  if (completed !== undefined) filter.completed = completed === "true";
  if (category) filter.category = category;
  if (search && search.trim()) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (safePage - 1) * safeLimit;
  const [todos, totalItems] = await Promise.all([
    Todo.find(filter).populate("category", "name description").sort({ [sortBy]: sortDirection }).skip(skip).limit(safeLimit),
    Todo.countDocuments(filter),
  ]);
  return { todos, pagination: { currentPage: safePage, totalPages: Math.ceil(totalItems / safeLimit), totalItems, itemsPerPage: safeLimit } };
}

async function getAllTodosForAdmin(queryOptions = {}) {
  const { page = 1, limit = 10, completed, sortBy = "createdAt", order = "desc", search } = queryOptions;
  const filter = { archived: false };
  if (completed !== undefined) filter.completed = completed === "true";
  if (search && search.trim()) filter.title = { $regex: search, $options: "i" };
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const skip = (safePage - 1) * safeLimit;
  const [todos, totalItems] = await Promise.all([
    Todo.find(filter).populate("owner", "name email").populate("category", "name description").sort({ [sortBy]: order === "asc" ? 1 : -1 }).skip(skip).limit(safeLimit),
    Todo.countDocuments(filter),
  ]);
  return { todos, pagination: { currentPage: safePage, totalPages: Math.ceil(totalItems / safeLimit), totalItems, itemsPerPage: safeLimit } };
}

async function getTodoById(id) {
  return Todo.findOne({ _id: id, archived: false }).populate("category", "name description");
}

async function updateTodo(id, data, ownerId, actorId = ownerId) {
  const oldTodo = await Todo.findOne({ _id: id, owner: ownerId, archived: false });
  if (!oldTodo) return null;

  if (Object.prototype.hasOwnProperty.call(data, "category")) {
    if (data.category === null || data.category === "") {
      data.category = null;
    } else {
      const category = await Category.findOne({ _id: data.category, user: ownerId, archived: false });
      if (!category) {
        const error = new Error("Kategori tidak ditemukan atau bukan milik pengguna");
        error.statusCode = 400;
        throw error;
      }
    }
  }

  const update = { ...data, updated_by: actorId };
  const updated = await Todo.findOneAndUpdate(
    { _id: id, owner: ownerId, archived: false },
    { $set: update },
    { new: true, runValidators: true }
  ).populate("category", "name description");

  await ActivityLog.createLog(actorId, "update", id, {
    before: { title: oldTodo.title, completed: oldTodo.completed, category: oldTodo.category },
    after: { title: updated.title, completed: updated.completed, category: updated.category },
  });
  return updated;
}

async function deleteTodo(id, ownerId, actorId = ownerId) {
  const todo = await Todo.findOne({ _id: id, owner: ownerId, archived: false });
  if (!todo) return false;
  todo.archived = true;
  todo.updated_by = actorId;
  await todo.save();
  await ActivityLog.createLog(actorId, "delete", id, { deletedTitle: todo.title });
  return true;
}

async function getSummaryStats() {
  const totalTodos = await Todo.countDocuments({ archived: false });
  const completedTodos = await Todo.countDocuments({ completed: true, archived: false });
  const pendingTodos = totalTodos - completedTodos;
  const ActivityLogModel = require("../models/activity-log.model");
  const totalActivityLogs = await ActivityLogModel.countDocuments();
  return { totalTodos, completedTodos, pendingTodos, totalActivityLogs };
}

module.exports = { createTodo, getAllTodos, getAllTodosForAdmin, getTodoById, updateTodo, deleteTodo, getSummaryStats };
