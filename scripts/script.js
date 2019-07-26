const User = require('../models/user.model')

const makeUserBecomeAdmin = async (userId) => {
    try {
        let foundUser = await User.findById(userId)
        if (!foundUser) {
            throw 'Can not find user with ID: ' + userId
        }
        await foundUser.update({
            permission: 2,
            isBanned: 0,
            active: 1
        })
        console.log(`${foundUser.name} is now an admin`)
    } catch(error){
        console.log(`Error: ${error}`)
    }
}

makeUserBecomeAdmin('5d36c7dcaa96f70b6d7cd211')