const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
require("dotenv").config();

const logger = require("./config/logger");
const swaggerSpec = require("./config/swagger");
const authRoutes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const notFoundHandler = require("./middleware/notFoundHandler");

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// HTTP Logging
app.use(morgan("combined", { stream: logger.stream }));

// Routes
app.use("/", authRoutes);

// Swagger Docs Endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`User Service berjalan di http://localhost:${PORT}`);
  logger.info(`API Docs tersedia di http://localhost:${PORT}/api-docs`);
});
