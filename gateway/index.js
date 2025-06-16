const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const customThrottle = require('./customThrottle');

const app = express();

const gatewayLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: 'Too many requests, please try again later.'
});
app.use(gatewayLimiter);
app.use(customThrottle);

app.use('/users', createProxyMiddleware({ target: 'http://user-service:5001', changeOrigin: true }));
app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:5002', changeOrigin: true }));
app.use('/tweets', createProxyMiddleware({ target: 'http://tweet-service:5003', changeOrigin: true }));
app.use('/follows', createProxyMiddleware({ target: 'http://follow-service:5004', changeOrigin: true }));
app.use('/notifications', createProxyMiddleware({ target: 'http://notification-service:5005', changeOrigin: true }));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
