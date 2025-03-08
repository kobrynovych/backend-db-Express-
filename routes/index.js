import express from 'express'
import home from './home.js'
import auth from './auth.js'
import users from './users.js'
import tasks from './tasks.js'

const router = express.Router();

router.use('/', home)
router.use('/auth', auth)
router.use('/users', users)
router.use('/tasks', tasks)

export default router;
