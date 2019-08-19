module.exports = findParameter = (parameter) => {
    return (req, res) => {
        req[parameter] ? req[parameter] :
            req.body[parameter] ? req.body[parameter] :
                req.query[parameter] ? req.query[parameter] : req.params[parameter]
    }
}