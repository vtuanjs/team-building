module.exports.checkPermit = (...allowed) => {
    //Manager > Secreatary > User
    //The manager will have all user and secretary rights
    if (allowed.indexOf("user") > -1) {
        allowed.push("manager", "secretary")
    } else {
        if (allowed.indexOf("secretary") > -1) {
            allowed.push("manager")
        }
    }

    const isAllowed = role => allowed.indexOf(role) > -1;

    return (req, res, next) => {
        if (req.user && isAllowed(req.user.role)) return next()
        else return res.status(403).json({
            result: "failed",
            message: "You don't have authorization to do this action!"
        })
    }
}

