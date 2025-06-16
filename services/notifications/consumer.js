const amqp = require('amqplib');
const logger = require('./config/logger');
const Notification = require('./models/notification');
const axios = require('axios');

const NOTIFICATION_QUEUE = 'notification_queue';

// Fungsi untuk mengambil nama user dari User Service
async function getUserName(userId) {
  try {
    const userServiceUrl = `http://localhost:5001/profile/${userId}`;
    const response = await axios.get(userServiceUrl);
    return response.data.name;
  } catch (error) {
    logger.error(`Gagal mendapatkan nama untuk user ${userId}:`, error.message);
    return `Seseorang`; // Fallback name
  }
}

async function startConsumer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true });

    logger.info(`[*] Menunggu pesan di antrean: ${NOTIFICATION_QUEUE}.`);

    channel.consume(NOTIFICATION_QUEUE, async (msg) => {
      if (msg !== null) {
        try {
          const event = JSON.parse(msg.content.toString());
          logger.info(`[x] Menerima event: ${event.type}`);

          let message = '';
          let userIdToNotify = null;
          let link = null;

          switch (event.type) {
            case 'NEW_FOLLOWER':
              const followerName = await getUserName(event.data.followerId);
              userIdToNotify = event.data.followingId;
              message = `${followerName} mulai mengikuti Anda.`;
              link = `/profile/${event.data.followerId}`;
              break;
            
            case 'NEW_REPLY':
              const replierName = await getUserName(event.data.replierId);
              userIdToNotify = event.data.originalPosterId;
              message = `${replierName} membalas tweet Anda.`;
              link = `/tweet/${event.data.replyTweetId}`;
              break;

            // Tambahkan case untuk event lain seperti 'NEW_MENTION', dll.
          }
          
          if(userIdToNotify && message) {
            await Notification.create({
                userId: userIdToNotify,
                message,
                link,
            });
            logger.info(`Notifikasi disimpan untuk user ${userIdToNotify}`);
          }
          
          channel.ack(msg); // Konfirmasi bahwa pesan sudah diproses
        } catch (procError) {
          logger.error('Gagal memproses pesan:', procError);
          channel.nack(msg, false, false); // Pesan gagal proses, jangan di-requeue
        }
      }
    }, { noAck: false });
  } catch (error) {
    logger.error('Gagal terhubung atau membuat consumer RabbitMQ:', error);
    // Coba konek lagi setelah beberapa saat
    setTimeout(startConsumer, 5000);
  }
}

module.exports = { startConsumer };