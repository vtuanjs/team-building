const express = require('express')
const app = express()
const http = require('http')
const winston = require('winston')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const { PORT, HOST } = require('./helpers/utility.js')
const indexRouter = require('./routes/index.route')
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
const companyRouter = require('./routes/company.route')
const projectRoute = require('./routes/project.route')
// const productRouter = require('./routes/product.route')
// const commentRouter = require('./routes/comment.route')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.set('views', './views')
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/user/', userRouter)
app.use('/auth/', authRouter)
app.use('/company/', companyRouter)
app.use('/project/', projectRoute)
// app.use('/product/', productRouter)
// app.use('/comment/', commentRouter)


const server = http.createServer(app)

const logger = winston.createLogger({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: '../logs/weblog.log' })
    ]
})

server.on('error', (error) => {
    logger.log('error', error)
})

server.listen(PORT, HOST, () => {
    logger.log('info', `Server is starting at ${new Date()}`)
})

console.log(`Running on: ${HOST}:${PORT}`)