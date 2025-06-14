require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: process.env.CI_DB_USER || process.env.DB_USER,
    password: process.env.CI_DB_PASSWORD || process.env.DB_PASSWORD,
    database: process.env.CI_DB_NAME || process.env.DB_NAME,
    host: process.env.CI_DB_HOST || '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOST,
    dialect: 'mysql'
  }
};