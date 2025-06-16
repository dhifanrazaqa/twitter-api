const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/database');
require('dotenv').config();

const logger = require('./config/logger');
const swaggerSpec = require('./config/swagger');
const userRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');
const { userLimiter, throttle } = require('./middleware/rateLimiter');

const app = express();
const PORT = process.env.PORT || 5001;

// Log untuk menampilkan nilai DB_USER dan DB_PASSWORD
console.log('ENV DB_USER:', process.env.DB_USER);
console.log('ENV DB_PASSWORD:', process.env.DB_PASSWORD);

// Middleware
app.use(cors());
app.use(userLimiter); // Rate limiting middleware
app.use(throttle); // Throttling middleware (delay antar request)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging dengan Morgan yang diarahkan ke Winston
app.use(morgan('combined', { stream: logger.stream }));

// Routes
app.use('/', userRoutes);

// Swagger Docs Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Not Found Handler (harus setelah routes)
app.use(notFoundHandler);

// Centralized Error Handler (harus di paling akhir)
app.use(errorHandler);

// Sinkronisasi DB dan jalankan server
const startServer = async () => {
  try {
    await sequelize.sync();
    logger.info('Database terhubung & tersinkronisasi');
    app.listen(PORT, () => {
      logger.info(`User Service berjalan di http://localhost:${PORT}`);
      logger.info(`API Docs tersedia di http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    logger.error('Gagal terhubung ke DB:', err);
    process.exit(1);
  }
};

startServer();