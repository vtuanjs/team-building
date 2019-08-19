const isAdmin = (user) => {
    return user.role === "admin"
}

const isCompanyMember = (user, companyId) => {
    return user.company.id && user.company.id.equals(companyId)
}

const isCompanyManager = (user, companyId) => {
    return user.company.id && user.company.id.equals(companyId) &&
        user.company.role === "manager"
}

const isProjectMember = (user, projectId) => {
    return user.projects.some(item => (item.id.equals(projectId)))
}

const isProjectAuthor = (user, projectId) => {
    return user.projects.some(item => (item.id.equals(projectId) &&
        item.role === "author"))
}

const checkPermit = (...checks) => {
    let permit = 0
    for (let i = 0; i < checks.length; i++) {
        if (checks[i]) permit = 1
    }
    return permit
}
module.exports = {
    isAdmin, isCompanyMember, isCompanyManager,
    isProjectMember, isProjectAuthor, checkPermit
}
