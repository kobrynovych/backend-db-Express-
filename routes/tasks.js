import express from 'express'
import { getAllTasks, createTask, getTask, updateTask, deleteTask } from '../controllers/tasks.js';
import { authenticated } from '../middlewares/authenticated.js';
import { hasRole } from '../middlewares/hasRole.js';

const router = express.Router()

router.get('/', authenticated, hasRole('admin'), getAllTasks);
router.post('/', authenticated, hasRole('admin'), createTask);
router.get('/:taskId', authenticated, hasRole('admin'), getTask);
router.put('/:taskId', authenticated, hasRole('admin'), updateTask);
router.delete('/:taskId', authenticated, hasRole('admin'), deleteTask);

export default router
