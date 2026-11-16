const todoService = require("../services/todo.service");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const createTodo = catchAsync(async (req, res) => {
  const todo = await todoService.createTodo(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: "Todo created successfully",
    data: todo
  });
});

const getAllTodos = catchAsync(async (req, res, next) => {
  const { page, limit, completed, sortBy, order, search } = req.query;
  const queryOptions = { page, limit, completed, sortBy, order, search };


  const result =
    req.user.role === "admin"
      ? await todoService.getAllTodosForAdmin(queryOptions)
      : await todoService.getAllTodos(req.user._id, queryOptions);

  res.status(200).json({
    success: true,
    message: "Todos retrieved successfully",
    data: result.todos,
    pagination: result.pagination,
  });
});

const getTodoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const todo = await todoService.getTodoById(id);

  if (!todo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = todo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to access this todo", 403));
  }

  res.status(200).json({
    success: true,
    message: "Todo retrieved successfully",
    data: todo,
  });
});

const updateTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, description, completed, category } = req.body;

  const existingTodo = await todoService.getTodoById(id);

  if (!existingTodo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = existingTodo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to update this todo", 403));
  }

  const ownerId = existingTodo.owner._id || existingTodo.owner;
  const updateData = {};
  for (const [key, value] of Object.entries({ title, description, completed, category })) {
    if (value !== undefined) updateData[key] = value;
  }
  const updatedTodo = await todoService.updateTodo(id, updateData, ownerId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    data: updatedTodo,
  });
});

const deleteTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingTodo = await todoService.getTodoById(id);

  if (!existingTodo) {
    return next(new AppError("Todo not found", 404));
  }

  const isOwner = existingTodo.owner.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("You do not have permission to delete this todo", 403));
  }

  const ownerId = existingTodo.owner._id || existingTodo.owner;
  await todoService.deleteTodo(id, ownerId, req.user._id);

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    data: existingTodo,
  });
});

module.exports = {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
};