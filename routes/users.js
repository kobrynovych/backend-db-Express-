import express from 'express'
import { getAllUsers, createUser, getUser, updateUser, deleteUser } from '../controllers/users.js';
import { authenticated } from '../middlewares/authenticated.js';
import { hasRole } from '../middlewares/hasRole.js';

const router = express.Router()

router.get('/', authenticated, hasRole('limited_user'), getAllUsers);
router.post('/', authenticated, hasRole('admin'), createUser);
router.get('/:id', authenticated, hasRole('user'), getUser);
router.put('/:id', authenticated, hasRole('admin'), updateUser);
router.delete('/:id', authenticated, hasRole('admin'), deleteUser);

export default router
