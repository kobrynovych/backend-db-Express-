import { getRoleByUserLogin } from '../service/users.service.js';
import * as authenticationService from './authentication.service.js';

export const signIn = async (req, res, next) => {
    try {
        const { login, password } = req.body;

        const token = await authenticationService.authenticateUser(login, password);

        // res.cookie('token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true });
        // // res.cookie('token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true, secure: true });  // https === true

        req.session.token = token;
        req.session.role = await getRoleByUserLogin(login);

        // return res.json({ token });  // not send token
        // return res.json({});
        return res.redirect('/users');
    } catch (error) {
        return next(error);
    }
};

export const signUp = async (req, res, next) => {
    try {
        const { login, password, role } = req.body;

        const newUser = await authenticationService.registerNewUser(login, password, role);


        // kim signIn
        const token = await authenticationService.authenticateUser(login, password);
        req.session.token = token;
        req.session.role = newUser.role;


        // return res.json(newUser);
        // return res.redirect('/');
        return res.redirect('/users');
    } catch (error) {
        return next(error);
    }
};
