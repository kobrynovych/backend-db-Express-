import express from 'express';
import { styleText } from 'node:util'
// import cookieParser from 'cookie-parser'
import session from 'express-session'
// import MongoStore from 'connect-mongo';
import createError from 'http-errors'
import helmet from "helmet";
import compression from 'compression'
import cors from 'cors'
import methodOverride from 'method-override';
import router from './routes/index.js';
import { PUBLIC_HOSTNAME, PUBLIC_PORT, SESSION_SECRET_KEY } from './config/constants.js';
import { rateLimiterMiddleware } from './middlewares/rateLimiter.js';
import { loggerMorgan } from './middlewares/loggerMorgan.js';
import { loggerWinston } from './middlewares/loggerWinston.js';
import { loggerPino } from './middlewares/loggerPino.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { errorNotification } from './middlewares/errorNotification.js';
import { sessionHandler } from './middlewares/sessionHandler.js';
import './database.js';


const app = express();

// Compress all responses
app.use(compression())

// Enable All CORS Requests
app.use(cors())

// Using middleware to limit speed on all routes
app.use(rateLimiterMiddleware);

// Use Helmet!
app.use(helmet());

// view engine setup
app.set('view engine', 'ejs');

// Loggers
app.use(loggerMorgan);   
// app.use(loggerWinston);   
// app.use(loggerPino);   

app.use(express.json());
app.use(express.urlencoded({ extended: false }));  // parse HTML-FORM using POST Content-Type: application/x-www-form-urlencoded
app.use(methodOverride('_method'));

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

// app.use((req, res, next) => {
//     console.log(req.method);
//     next();
// });

app.use(sessionHandler);

app.use("/", router);

// Middleware for error handling
app.use(errorHandler);

if (process.env.NODE_ENV === 'development') {   // assumes NODE_ENV is set by the user
    app.use(errorNotification);  // only use in development
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404, `Sorry can't find that!`));
});

app.listen(PUBLIC_PORT, PUBLIC_HOSTNAME, () => {
    console.log(
        styleText(['red'], 'Server ') +
        'running at ' +
        styleText(['green', 'bold'], `http://${PUBLIC_HOSTNAME}:${PUBLIC_PORT}/ `) 
    );
});
