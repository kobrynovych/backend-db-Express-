export const sessionHandler = (req, res, next) => {
    res.locals.userRoleGlobal = req.session.role;
    next();
};