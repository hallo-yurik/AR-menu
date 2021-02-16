const shouldBeLogged = (req, res, next) => {

    if (req.user && req.user.isAuthenticated) {
        next()
    } else {
        res.status(401).json({message: "You don`t have permissions"})
        res.end()
    }
}

module.exports = shouldBeLogged;