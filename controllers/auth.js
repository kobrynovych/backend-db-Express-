import { authenticateUser, registerNewUser } from "../services/auth.js";
import { getRoleByUserLogin } from "../services/users.js";

export const signin = (req, res) => {
    res.render('signin', {
        userRole: req.session.role,
    });
};

export const signinForm = async (req, res, next) => {
    try {
        const { login, password } = req.body;

        const token = await authenticateUser(login, password);

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

export const signup = (req, res) => {
    res.render('signUp', {
        userRole: req.session.role,
    });
};

export const signupForm = async (req, res, next) => {
    try {
        const { login, password, role } = req.body;

        const newUser = await registerNewUser(login, password, role);


        // kim signIn
        const token = await authenticateUser(login, password);
        req.session.token = token;
        req.session.role = newUser.role;


        // return res.json(newUser);
        // return res.redirect('/');
        return res.redirect('/users');
    } catch (error) {
        return next(error);
    }
};

export const logOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('err logOut: ', err);

            return res.status(500).send('err logOut');
        }

        // res.redirect('/login');
        return res.redirect('/'); 
    });
};