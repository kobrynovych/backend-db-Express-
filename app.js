// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

////////////

import express from 'express';
// import './db.js';
// import * as usersController from './src/users/users.controller.js';
import * as authenticationController from './authentication/authentication.controller.js';
// import { errorLogger } from './src/errors/middlewares/error-logger.middleware.js';
// import { standardErrorResponser } from './src/errors/middlewares/standard-error-responser.middleware.js';
import { hasRole } from './authorization/middlewares/has-role.middleware.js';
import { authenticated } from './authentication/middlewares/authenticated.middleware.js';
// import { addCurrentUserIdToParams } from './authentication/middlewares/add-current-user-id-to-params.middleware.js';
import { PUBLIC_PORT } from './config/constants.js';


const PORT = PUBLIC_PORT;

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/media', express.static('public'));

app.use((req, res, next) => {
    console.log(req.method);
    next();
});

app.get('/', (req, res) => {
    res.render('home', {
        courseName: 'Node.js Basic',
        lessonName: 'Express.js Basic'
    });
});

app.post('/signin', authenticationController.signIn);
app.post('/signup', authenticationController.signUp);

app.get('/users/me', authenticated, hasRole('limited_user'), (req, res) => {
    res.render('home', {
        courseName: 'Node.js Basic',
        lessonName: 'Express.js Basic'
    });
});

app.get('/users/me2', authenticated, hasRole('admin'), (req, res) => {
    res.render('home', {
        courseName: 'Node.js Basic',
        lessonName: 'Express.js Basic'
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

app.listen(PORT, () => {
    console.log('Server successfuly started on port ' + PORT);
});