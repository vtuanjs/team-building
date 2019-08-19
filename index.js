const express = require('express')
const app = express()
const http = require('http')
const winston = require('winston')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const { PORT, HOST } = require('./helpers/utility.js')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.set('views', './views')
app.use(cookieParser())

app.use('/', require('./routes/index.route'))
app.use('/user/', require('./routes/user.route'))
app.use('/auth/', require('./routes/auth.route'))
app.use('/company/', require('./routes/company.route'))
app.use('/project/', require('./routes/project.route'))
app.use('/plant/', require('./routes/plant.route'))
app.use('/job/', require('./routes/job.route'))
app.use('/team/', require('./routes/team.route'))
app.use('/comment/', require('./routes/comment.route'))

app.use((err, req, res, next) => {
    res.status(500).json({
        result: "failed",
        message: "Something went wrong! " + err
    })
});

const server = http.createServer(app)

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: './logs/weblog.log' })
    ]
})

server.on('error', (error) => {
    logger.log('error', error)
})

server.listen(PORT, HOST, () => {
    logger.log('info', `Server is starting at ${new Date()}`)
})

console.log(`Running on: ${HOST}:${PORT}`)