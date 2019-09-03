const mongoose = require('mongoose')
const { MongoMemoryReplSet, MongoMemoryServer } = require('mongodb-memory-server')
const mongoServer = new MongoMemoryServer()

mongoose.set('useFindAndModify', false);
const connect = async () => {
    try {
        let url = process.env.MONGO_URL
        let options = {
            connectTimeoutMS: 10000,
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
        if (process.env.NODE_ENV === 'test') {
            const replSet = new MongoMemoryReplSet();
            await replSet.waitUntilRunning();
            const mongoUri = await mongoServer.getConnectionString()
            await mongoose.connect(mongoUri, options)
            console.log('Connect database successfully!')
        } else {
            await mongoose.connect(url, options)
            console.log('Connect database successfully!')
        }
    } catch (error) {
        console.log(`Connect database error: ${error}`)
    }
}

const close = async () => {
    if (process.env.NODE_ENV === 'test') {
        await mongoose.disconnect();
        await mongoServer.stop();
    } else {
        return mongoose.disconnect()
    }
}

module.exports = { connect, close }