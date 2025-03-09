import { getUsers } from "../models/users.js";

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

export const getUser = (req, res) => {
    return res.json({});
};

export const updateUser = (req, res) => {
    return res.json({});
};

export const deleteUser = (req, res) => {
    return res.json({});
};
