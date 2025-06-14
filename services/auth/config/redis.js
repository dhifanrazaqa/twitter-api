const Redis = require("ioredis");
const logger = require("./logger");
require("dotenv").config();

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  db: process.env.REDIS_DB,
});

client.on("connect", () => {
  logger.info("Terhubung ke Redis");
});

client.on("error", (err) => {
  logger.error("Gagal terhubung ke Redis:", err);
});

module.exports = client;
