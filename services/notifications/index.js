const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerSpec = require("./config/swagger");

const { startConsumer } = require('./consumer');
const sequelize = require('./config/database');
const logger = require('./config/logger');

const NotificationRoutes = require('./routes/index')


const startServer = async () => {
    try {
        await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
        logger.info('Database Notifikasi tersinkronisasi.');

        // Jalankan RabbitMQ Consumer
        startConsumer();

        // Jalankan Server Express
        const app = express();
        // ... (semua middleware app.use() seperti di service lain)

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        app.use('/', NotificationRoutes);

        app.listen(process.env.PORT, () => {
            logger.info(`Notification Service API berjalan di port ${process.env.PORT}`);
        });

    } catch (err) {
        logger.error('Gagal memulai Notification Service:', err);
        process.exit(1);
    }
};

startServer();