import { verifyAuthToken } from '../services/auth.js';

export const authenticated = (req, res, next) => {
    try {
        // const { token } = req.body;
        // const token = req.cookies.token;
        const token = req?.session?.token;

        if (token) {
            verifyAuthToken(token);

            return next();
        } else {
            // User is not logged in, we are redirecting
            res.redirect('/auth/signin');
        }
    } catch (error) {
        // next(new NotAuthenticatedError());
        next(error);  
    }
};
