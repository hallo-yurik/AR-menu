const shouldNotBeLogged = (req, res, next) => {
    if (req.user && req.user.isAuthenticated) {
        res.json({message: "You are already authenticated"})
        res.end()
    } else {
        next()
    }
}

module.exports = shouldNotBeLogged;