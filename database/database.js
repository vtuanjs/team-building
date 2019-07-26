const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);
const connectDatabase = async () => {
    try {
        let url = 'mongodb://tuan:12345678@localhost:27018/db'
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
connectDatabase()
module.exports = mongoose