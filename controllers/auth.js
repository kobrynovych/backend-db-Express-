import { authenticateUser, registerNewUser } from "../services/auth.js";

export const signin = (req, res) => {
    res.render('signin', {
        userRole: req.session.role,
    });
};

export const signinForm = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { token, role } = await authenticateUser(email, password);

        // res.cookie('token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true });
        // // res.cookie('token', token, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true, secure: true });  // https === true

        req.session.token = token;
        req.session.role = role;

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
        const { firstName, lastName, email, password, role, dateOfBirth, profilePicture } = req.body;

        const { token, role: userRole } = await registerNewUser({ firstName, lastName, email, password, role, dateOfBirth, profilePicture });

        req.session.token = token;
        req.session.role = userRole;

        return res.redirect('/users');
    } catch (error) {
        return next(error);
    }
};

export const logOut = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error during logout:', error);
            // return res.status(500).send('err logOut');
            return next(error);
        }

        return res.redirect('/'); 
    });
};