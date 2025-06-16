const ipRequestTimes = {};
const THROTTLE_DELAY = 500; // ms
const RAPID_REQUEST_LIMIT = 3;
const RAPID_WINDOW = 2000; // ms

function customThrottle(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  if (!ipRequestTimes[ip]) {
    ipRequestTimes[ip] = [];
  }
  ipRequestTimes[ip] = ipRequestTimes[ip].filter(ts => now - ts < RAPID_WINDOW);
  ipRequestTimes[ip].push(now);

  if (ipRequestTimes[ip].length >= RAPID_REQUEST_LIMIT) {
    setTimeout(next, THROTTLE_DELAY);
  } else {
    next();
  }
}

module.exports = customThrottle;
