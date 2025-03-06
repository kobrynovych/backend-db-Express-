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

import createError from 'http-errors'

import helmet from "helmet";

import { RateLimiterMemory } from 'rate-limiter-flexible'

import compression from 'compression'

import cors from 'cors'

import errorhandler from 'errorhandler'

import notifier from 'node-notifier'

import mongoose from 'mongoose'







const app = express();








// Compress all responses
app.use(compression())

// Enable All CORS Requests
app.use(cors())



// Speed ​​limiter settings
const rateLimiter = new RateLimiterMemory({
    points: 3, // Maximum number of requests
    duration: 1, // Duration in seconds (1 second)
});

// Speed ​​Limiting Middleware
const rateLimiterMiddleware = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip); // We use the client's IP address as a key
        next();
    } catch (rejRes) {
        res.status(429).send('Too many requests, please try again later.');
    }
};

// Using middleware to limit speed on all routes
app.use(rateLimiterMiddleware);





// Use Helmet!
app.use(helmet());

// view engine setup
app.set('view engine', 'ejs');

// morgan
app.use(logger('dev'));     // 'dev', 'combined', 'common', 'short', 'tiny'

// // winston 
// const logger2 = winston.createLogger({
//     level: 'info', // info, error, warn, debug
//     format: winston.format.json(), // JSON
//     transports: [
//         new winston.transports.Console(), // Outputting logs to the console
//         new winston.transports.File({ filename: 'combined.log' }), // Writing logs to the combined.log file
//     ],
// });
// // Middleware for query logging
// app.use((req, res, next) => {
//     const start = Date.now();

//     res.on('finish', () => {
//         const duration = Date.now() - start;

//         logger2.info({
//             message: 'HTTP Request',
//             method: req.method,
//             url: req.url,
//             status: res.statusCode,
//             duration: duration,
//         });
//     });

//     next();
// });
// // logger2.info('Це інформаційне повідомлення');
// // logger2.error('Це повідомлення про помилку');

// // pino
// const logger3 = pino({
//     transport: {
//         target: 'pino-pretty', // Output logs in a nice format
//     },
// });

// // Middleware for query logging
// const pinoHttpLogger = pinoHttp({
//     logger: logger3,
// });
// app.use(pinoHttpLogger);



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
    // name: 'sessionId',           // default name is used: 'connect.sid'
    resave: false,
    saveUninitialized: true,
    cookie: { 
        // secure: true,                        // https === true
        // httpOnly: true,                      // https === true
        // // domain: 'example.com',
        // // path: 'foo/bar',
        // expires: new Date(Date.now() + 24 * 60 * 60 * 1000)     // 1 day
    },  
    // store: sessionStore,
})); 

app.use('/media', express.static('public'));

app.use((req, res, next) => {
    console.log(req.method);
    next();
});



// assumes NODE_ENV is set by the user
if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorhandler({ log: errorNotification }))
}

function errorNotification (err, str, req) {
    let title = 'Error in ' + req.method + ' ' + req.url

    notifier.notify({
        title: title,
        message: str
    })
}


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

app.get('/users/edit/:userId', authenticated, hasRole('admin'), (req, res) => {
    // console.log(req.params.userId);

    res.render('users-edit', {
        userRole: req.session.role,
    });
})

// app.get('/users/me', authenticated, hasRole('limited_user'), addCurrentUserIdToParams, usersController.findById);
// app.get('/users', authenticated, hasRole('admin'), usersController.findAll);
// app.get('/users/:id', authenticated, hasRole('admin'), usersController.findById);

// app.post('/users', authenticated, hasRole('admin'), usersController.create);
// app.put('/users/:id', authenticated, hasRole('admin'), usersController.update);
// app.delete('/users/:id', authenticated, hasRole('admin'), usersController.remove);

// app.use(errorLogger);
// app.use(standardErrorResponser);







// 
// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('🔗 Підключено до MongoDB'))
    .catch(err => console.error('❌ Помилка підключення до MongoDB:', err));

// Створення схеми для задач
const taskSchema = new mongoose.Schema({
    title: String,
    completed: Boolean
});

// Модель для роботи з колекцією "tasks"
const Task = mongoose.model('Task', taskSchema);

// 📌 Отримати всі задачі
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// 📌 Додати нову задачу
app.post('/tasks', async (req, res) => {
    const { title, completed } = req.body;
    const newTask = new Task({ title, completed: completed || false });
    await newTask.save();
    res.status(201).json(newTask);
});

// 📌 Оновити задачу за ID
app.put('/tasks/:id', async (req, res) => {    
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).json({ error: 'Задачу не знайдено' });
    res.json(updatedTask);
});

// 📌 Видалити задачу за ID
app.delete('/tasks/:id', async (req, res) => {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: 'Задачу не знайдено' });
    res.json({ message: '✅ Задача видалена' });
});
// ./








// app.use(function (req, res, next) {
//     if (!req.user) return next(createError(401, 'Please login to view this page.'))
//     next()
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404, `Sorry can't find that!`));
});


// // error handler
// app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};

//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

app.listen(PUBLIC_PORT, PUBLIC_HOSTNAME, () => {
    console.log(
        styleText(['red'], 'Server ') +
        'running at ' +
        styleText(['green', 'bold'], `http://${PUBLIC_HOSTNAME}:${PUBLIC_PORT}/ `) 
    );
});
