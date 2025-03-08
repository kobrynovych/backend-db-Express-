export const getAllUsers = (req, res) => {
    res.render('users', {
        userRole: req.session.role,
    });
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
