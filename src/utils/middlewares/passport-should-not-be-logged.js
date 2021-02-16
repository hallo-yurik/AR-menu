const shouldNotBeLogged = (req, res, next) => {

    if (req.user && req.user.isAuthenticated) {
        res.status(401).json({message: ["You are already authenticated"]})
        res.end()
    } else {
        next()
    }
}

module.exports = shouldNotBeLogged;