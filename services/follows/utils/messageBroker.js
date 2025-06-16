const amqp = require('amqplib');
const logger = require('../config/logger');

const NOTIFICATION_QUEUE = 'notification_queue';
let channel = null;

async function connect() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });
    logger.info('Terhubung ke RabbitMQ untuk publishing.');
  } catch (error) {
    logger.error('Gagal terhubung ke RabbitMQ sebagai publisher:', error);
  }
}

function publishEvent(event) {
  if (channel) {
    channel.sendToQueue(NOTIFICATION_QUEUE, Buffer.from(JSON.stringify(event)), { persistent: true });
    logger.info(`[x] Mengirim event: ${event.type}`);
  } else {
    logger.error('Channel RabbitMQ tidak tersedia. Event tidak terkirim.');
  }
}

module.exports = { connect, publishEvent };