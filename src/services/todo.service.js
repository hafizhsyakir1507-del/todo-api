const Todo = require("../models/todo.model");
const ActivityLog = require("./activity-log.service");
const catchAsync = require("../utils/catchAsync");

async function createTodo(data, userId) {
  const todo = new Todo({
    title: data.title,
    description: data.description,
    owner: userId
  });
  await todo.save();

  await ActivityLog.createLog(userId, "create", todo._id, {
    title: data.title,
    description: data.description
  });

  return todo;
}



async function getAllTodos(ownerId, queryOptions) {
  const { page = 1, limit = 10, completed, sortBy = "createdAt", order = "desc", search } = queryOptions;

  const filter = { owner: ownerId };

  if (completed !== undefined) {
    filter.completed = completed === "true";
  }

  if (search && search.trim() !== "") {
  filter.$or = [
    { title: { $regex: search, $options: "i" } },
    { description: { $regex: search, $options: "i" } }
  ];
}

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (Number(page) - 1) * Number(limit);

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(limit)),
    Todo.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / Number(limit));

  return {
    todos,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalItems,
      itemsPerPage: Number(limit),
    },
  };
}

async function getAllTodosForAdmin(queryOptions) {
  const { page = 1, limit = 10, completed, sortBy = "createdAt", order = "desc" } = queryOptions;

  const filter = {};

  if (completed !== undefined) {
    filter.completed = completed === "true";
  }

  const sortDirection = order === "asc" ? 1 : -1;
  const skip = (Number(page) - 1) * Number(limit);

  const [todos, totalItems] = await Promise.all([
    Todo.find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(Number(limit))
      .populate("owner", "name email"),
    Todo.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalItems / Number(limit));

  return {
    todos,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalItems,
      itemsPerPage: Number(limit),
    },
  };
}

async function getTodoById(id) {
  return await Todo.findById(id);
}

async function updateTodo(id, data, userId) {
  const oldTodo = await Todo.findOne({ _id: id, owner: userId });
  if (!oldTodo) return null;

  const updated = await Todo.findOneAndUpdate(
    { _id: id, owner: userId },
    data,
    { new: true, runValidators: true }
  );

  await ActivityLog.createLog(userId, "update", id, {
    before: { title: oldTodo.title, completed: oldTodo.completed },
    after: { title: updated.title, completed: updated.completed }
  });

  return updated;
}



async function deleteTodo(id, userId) {
  const todo = await Todo.findOne({ _id: id, owner: userId });
  if (!todo) return false;

  await Todo.findOneAndDelete({ _id: id, owner: userId });

  await ActivityLog.createLog(userId, "delete", id, {
    deletedTitle: todo.title
  });

  return true;
}

async function getSummaryStats() {
  const totalTodos = await Todo.countDocuments();
  const completedTodos = await Todo.countDocuments({ completed: true });
  const pendingTodos = totalTodos - completedTodos;

  const ActivityLog = require("../models/activity-log.model");
  const totalActivityLogs = await ActivityLog.countDocuments();

  return {
    totalTodos,
    completedTodos,
    pendingTodos,
    totalActivityLogs
  };
}

module.exports = {
  createTodo,
  getAllTodos,
  getAllTodosForAdmin,
  getTodoById,
  updateTodo,
  deleteTodo,
  getSummaryStats,
};