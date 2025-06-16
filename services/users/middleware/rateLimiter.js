// Rate limiting middleware for users service
const rateLimit = require('express-rate-limit');

// Rate limiting: 10 requests per 60 seconds
const userLimiter = rateLimit({
  windowMs: 60 * 1000, // 60 detik
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Terlalu banyak permintaan dari IP ini, coba lagi setelah 1 menit.'
});

// Throttling: delay 500ms antar request
function throttle(req, res, next) {
  setTimeout(next, 500); // delay 500ms
}

module.exports = { userLimiter, throttle };
