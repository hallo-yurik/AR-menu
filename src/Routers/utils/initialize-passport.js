const LocalStrategy = require("passport-local").Strategy;

const findUserByEmail = (userName) => {
    return {username: "w", password: "w", id: 1}
}

const findUserById = (id) => {
    return {username: "w", password: "w", id: 1}
}

const authenticateUser = (userName, password, done) => {

    const user = findUserByEmail(userName)
    try {
        if (user != null && user.password === password) {
            return done(null, user)
        } else {
            return done(null, false, {message: "username or password is incorrect"})
        }
    } catch (err) {
        return done(err)
    }

}

const initialize = (passport) => {

    passport.use(new LocalStrategy(
        {},
        authenticateUser
    ))

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => {
        const user = findUserById(id)
        return done(null, user)
    })
}

module.exports = initialize;