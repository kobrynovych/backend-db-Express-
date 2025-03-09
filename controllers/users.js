import { editUser, getOneUser, getUsers, removeUser } from "../models/users.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getUsers();

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.render('users', {
                userRole: req.session.role,
                users: users,
            });
        } else {
            res.json(users);
        }
    } catch (error) {
        next(error); 
    }
};

export const createUser = (req, res) => {
    return res.json({});
};

export const getUser = async (req, res, next) => {
    try {
        const user = await getOneUser(req.params.id);

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.render('user-edit', {
                userRole: req.session.role,
                user: user,
            });
        } else {
            res.json(user);
        }
    } catch (error) {
        next(error); 
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const user = await editUser(req.params.id, req.body);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.redirect('/users');
        } else {
            res.json(user);
        }
    } catch (error) {
        next(error); 
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const deletedUser = await removeUser(req.params.id);

        if (!deletedUser) {
            // throw new CustomError('User not found', 404);
            return res.status(404).json({ error: 'User not found' });
        } 
        
        if (req.headers.accept && req.headers.accept.includes('text/html')) {        
            res.redirect('/users');
        } else {
            res.json({ message: 'User deleted' });
        }
    } catch (error) {
        next(error); 
    }
};
