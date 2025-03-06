import express from 'express';
import path from 'node:path'
import { styleText } from 'node:util'
// import './db.js';
// import * as usersController from './src/users/users.controller.js';
import * as authenticationController from './authentication/authentication.controller.js';
// import { errorLogger } from './src/errors/middlewares/error-logger.middleware.js';
// import { standardErrorResponser } from './src/errors/middlewares/standard-error-responser.middleware.js';
import { hasRole } from './authorization/middlewares/has-role.middleware.js';
import { authenticated } from './authentication/middlewares/authenticated.middleware.js';
// import { addCurrentUserIdToParams } from './authentication/middlewares/add-current-user-id-to-params.middleware.js';
import { PUBLIC_HOSTNAME, PUBLIC_PORT, SESSION_SECRET_KEY } from './config/constants.js';
// import cookieParser from 'cookie-parser'
import session from 'express-session'
// import MongoStore from 'connect-mongo';

import logger from 'morgan'
import winston from 'winston'
import pino from 'pino'
import pinoHttp from 'pino-http'


const app = express();

// view engine setup
app.set('view engine', 'ejs');

// morgan
app.use(logger('dev'));     // 'dev', 'combined', 'common', 'short', 'tiny'

// winston 
const logger2 = winston.createLogger({
    level: 'info', // info, error, warn, debug
    format: winston.format.json(), // JSON
    transports: [
        new winston.transports.Console(), // Outputting logs to the console
        new winston.transports.File({ filename: 'combined.log' }), // Writing logs to the combined.log file
    ],
});
// Middleware for query logging
app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        logger2.info({
            message: 'HTTP Request',
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: duration,
        });
    });

    next();
});
// logger2.info('Це інформаційне повідомлення');
// logger2.error('Це повідомлення про помилку');

// pino
const logger3 = pino({
    transport: {
        target: 'pino-pretty', // Output logs in a nice format
    },
});

// Middleware for query logging
const pinoHttpLogger = pinoHttp({
    logger: logger3,
});
app.use(pinoHttpLogger);



app.use(express.json());
app.use(express.urlencoded({ extended: false }));  // parse HTML-FORM using POST Content-Type: application/x-www-form-urlencoded

// app.use(cookieParser());

// const sessionStore = MongoStore({
//     mongoUrl: 'mongodb://localhost/your-database',
//     collectionName: 'sessions',
//     ttl: 60 * 60,
// });

app.use(session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },   // https === true
    // store: sessionStore,
})); 

app.use('/media', express.static('public'));

app.use((req, res, next) => {
    console.log(req.method);
    next();
});

// test
// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get('/', (req, res) => {
    res.render('home', {
        userRole: req.session.role,
    });
});

app.post('/signin', authenticationController.signIn);
app.post('/signup', authenticationController.signUp);
app.get('/logout', authenticationController.logOut);

app.get('/signup', (req, res) => {
    res.render('signUp', {
        userRole: req.session.role,
    });
});

app.get('/signin', (req, res) => {
    res.render('signin', {
        userRole: req.session.role,
    });
});

app.get('/users', authenticated, hasRole('limited_user'), (req, res) => {
    res.render('users', {
        userRole: req.session.role,
    });
});

app.get('/users/edit', authenticated, hasRole('admin'), (req, res) => {
    res.render('users-edit', {
        userRole: req.session.role,
    });
});

// app.get('/users/me', authenticated, hasRole('limited_user'), addCurrentUserIdToParams, usersController.findById);
// app.get('/users', authenticated, hasRole('admin'), usersController.findAll);
// app.get('/users/:id', authenticated, hasRole('admin'), usersController.findById);

// app.post('/users', authenticated, hasRole('admin'), usersController.create);
// app.put('/users/:id', authenticated, hasRole('admin'), usersController.update);
// app.delete('/users/:id', authenticated, hasRole('admin'), usersController.remove);

// app.use(errorLogger);
// app.use(standardErrorResponser);


app.listen(PUBLIC_PORT, PUBLIC_HOSTNAME, () => {
    console.log(
        styleText(['red'], 'Server ') +
        'running at ' +
        styleText(['green', 'bold'], `http://${PUBLIC_HOSTNAME}:${PUBLIC_PORT}/ `) 
    );
});
