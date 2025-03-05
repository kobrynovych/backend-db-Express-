import jsonwebtoken from 'jsonwebtoken';
// import { NotAuthenticatedError } from '../../errors/models/not-authenticated-error.model.js';
// import { WEB_TOKEN_SECRET_KEY } from '../../config/constants';

const WEB_TOKEN_SECRET_KEY = 'k41Mvn3hsi45';

export const authenticated = (req, res, next) => {
    try {
        const { token } = req.body;

        // jsonwebtoken.verify(token, WEB_TOKEN_SECRET_KEY );
        jsonwebtoken.verify(token, 'k41Mvn3hsi45' );
        return next();
    } catch (error) {
        // next(new NotAuthenticatedError());
        next(error);  
    }
};