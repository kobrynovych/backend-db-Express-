import { RateLimiterMemory } from 'rate-limiter-flexible'

// Speed ​​limiter settings
const rateLimiter = new RateLimiterMemory({
    points: 3, // Maximum number of requests
    duration: 1, // Duration in seconds (1 second)
});

// Speed ​​Limiting Middleware
export const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip); // We use the client's IP address as a key
        next();
    } catch (rejRes) {
        res.status(429).send('Too many requests, please try again later.');
    }
};
