const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const connect = async () => {
    try {
        let url = process.env.MONGO_URL
        let options = {
            connectTimeoutMS: 10000,
            useNewUrlParser: true,
            useCreateIndex: true
        }
        mongoose.connect(url, options)
        console.log('Connect database successfully!')
    } catch (error) {
        console.log(`Connect database error: ${error}`)
    }
}

const close = () => {
    return mongoose.disconnect()
}

module.exports = { connect, close }