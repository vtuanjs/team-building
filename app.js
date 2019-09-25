const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.set('views', './views')
app.use(cookieParser())
const allowAccessIp = process.env.ALLOW_ACCESS_IP || '*'

app.use('/', require('./routes/index.route'))
app.use('/user/', require('./routes/user.route'))
app.use('/auth/', require('./routes/auth.route'))
app.use('/company/', require('./routes/company.route'))
app.use('/project/', require('./routes/project.route'))
app.use('/groupJob/', require('./routes/groupJob.route'))
app.use('/job/', require('./routes/job.route'))
app.use('/subJob/', require('./routes/subJob.route'))
app.use('/team/', require('./routes/team.route'))
app.use('/comment/', require('./routes/comment.route'))


app.use(function (_req, res, next) {
    res.header("Access-Control-Allow-Origin", allowAccessIp);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use((error, _req, res, _next) => {
    res.status(400).json({ message: "Something went wrong! " + error })
})

module.exports = app
