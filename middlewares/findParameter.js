module.exports = findParameter = (parameter) => {
    return (req, res) => {
        res.locals[parameter] ? res.locals[parameter] :
            req.body[parameter] ? req.body[parameter] :
                req.query[parameter] ? req.query[parameter] : req.params[parameter]
    }
}