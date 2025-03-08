import winston from 'winston'
  
const logger = winston.createLogger({
    level: 'info', // info, error, warn, debug
    format: winston.format.json(), // JSON
    transports: [
        new winston.transports.Console(), // Outputting logs to the console
        new winston.transports.File({ filename: 'combined.log' }), // Writing logs to the combined.log file
    ],
});

export const loggerWinston = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        logger.info({
            message: 'HTTP Request',
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: duration,
        });
    });

    next();
};  

// use
// logger.info('This is an informational message.');
// logger.error('This is an error message.');
