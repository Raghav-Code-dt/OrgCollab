const {rateLimit} = require('express-rate-limit')

const authRateLimiter = rateLimit({
    windowMs : 15*60*1000,  // 15 min window
    limit : 5,        // a max of 5 atttempts in 15 minutes
    message : "Too many logins from the same user",
    standardHeaders: true, // Send IETF standard rate limit headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
})

module.exports = authRateLimiter;