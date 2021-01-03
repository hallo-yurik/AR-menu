const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect("/admin")
    } else {
        next()
    }
}

module.exports = checkNotAuthenticated;