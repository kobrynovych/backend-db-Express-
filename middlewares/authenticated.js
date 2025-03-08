import jsonwebtoken from 'jsonwebtoken';
// import { NotAuthenticatedError } from '../../errors/models/not-authenticated-error.model.js';
// import { WEB_TOKEN_SECRET_KEY } from '../../config/constants';

const WEB_TOKEN_SECRET_KEY = 'k41Mvn3hsi45';

export const authenticated = (req, res, next) => {
    try {
        // const { token } = req.body;
        // const token = req.cookies.token;
        const token = req.session.token;

        jsonwebtoken.verify(token, WEB_TOKEN_SECRET_KEY);  // kim ?
        return next();
    } catch (error) {
        // next(new NotAuthenticatedError());
        next(error);  
    }
};
