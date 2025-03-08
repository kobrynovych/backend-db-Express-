import express from 'express'
import { signin, signinForm, signup, signupForm, logOut } from '../controllers/auth.js';

const router = express.Router()

router.get('/signin', signin);
router.post('/signin', signinForm);
router.get('/signup', signup);
router.post('/signup', signupForm);
router.get('/logout', logOut);

export default router