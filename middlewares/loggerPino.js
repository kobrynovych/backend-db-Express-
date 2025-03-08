import pino from 'pino'
import pinoHttp from 'pino-http'
  
const logger = pino({
    transport: {
        target: 'pino-pretty', // Output logs in a nice format
    },
});

// Middleware for query logging
export const loggerPino = pinoHttp({
    logger: logger,
});
