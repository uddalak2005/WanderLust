const isLoggedIn = async (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash("error", "Please Login to gain access");
        res.redirect("/auth/login");
    }
    console.log(req.user);
    next();
}

module.exports = isLoggedIn;