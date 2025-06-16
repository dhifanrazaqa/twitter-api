// Basic API Gateway setup
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();

// Global rate limiter for the gateway
const gatewayLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests, please try again later.'
});
app.use(gatewayLimiter);

// Proxy routes
app.use('/users', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));
app.use('/auth', createProxyMiddleware({ target: 'http://localhost:5002', changeOrigin: true }));
// Tambahkan proxy untuk service lain jika diperlukan

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
