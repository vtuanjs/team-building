const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const secretString = "secret string"

const verifyJWT = async (tokenKey) => {
    try {
        let decodedJson = await jwt.verify(tokenKey, secretString)
        if (Date.now() / 1000 > decodedJson.exp) {
            throw "Token expire, please login again"
        }
        let foundUser = await User.findById(decodedJson.id)
        if (!foundUser) {
            throw "Can not find user with this token"
        }
        if (foundUser.isBanned === 1) {
            throw "User is blocked"
        }
        return foundUser
    } catch (error) {
        throw error
    }
}

const isAdmin = user => {
    return signedInUser.permission === 2
}

const isCompanyMember = (user, companyId) => {
    return user.company.id.equals(companyId)
}

const isCompanyManager = (user, companyId) => {
    return ( user.company.id.equals(companyId) && user.company.userPermission == 1)
}

const isProjectMember = (user, projectId) => {
    return user.projects.some(item => item.id.equals(projectId))
}

const isProjectManager = (user, projectId) => {
    return user.projects.some(item => (item.id.equals(projectId) && item.userPermistion === 1))
}

module.exports = {
    verifyJWT,
    isAdmin,
    isCompanyManager,
    isCompanyMember,
    isProjectManager,
    isProjectMember
}