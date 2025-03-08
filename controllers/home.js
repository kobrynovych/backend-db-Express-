export const home = (req, res) => {
    res.render('home', {
        userRole: req.session.role,
    });
};
