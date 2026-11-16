require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
const categoryRoutes = require("./routes/category.routes");
const todoRoutes = require("./routes/todo.routes");
const authRoutes = require("./routes/auth.routes");
const statsRoutes = require("./routes/stats.routes");
const activityLogRoutes = require("./routes/activity-log.routes");

const logger = require("./middlewares/logger.middleware");
const notFound = require("./middlewares/notFound.middleware");
const errorHandler = require("./middlewares/errorHandler.middleware");

const app = express();

app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Todo API is running!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Vercel menjalankan app.js secara langsung, jadi koneksi DB dibuat sebelum endpoint API.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/activity-logs", activityLogRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;