import { verifyAuthToken } from '../services/auth.js';

export const authenticated = (req, res, next) => {
    try {
        // const { token } = req.body;
        // const token = req.cookies.token;
        const token = req.session.token;

        verifyAuthToken(token);
        return next();
    } catch (error) {
        // next(new NotAuthenticatedError());
        next(error);  
    }
};
