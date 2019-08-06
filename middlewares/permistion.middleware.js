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

const isProjectManager = (user, projectId) => {
    return user.projects.some(item => (item.id.equals(projectId) &&
        item.role === "manager"))
}

const checkPermit = (...checks) => {
    return (next) => {
        // Call next if any check passes:
        for (let i = 0; i < checks.length; i++) {
            if (checks[i]) return next()
        }
        return next("You don't have authorization to do this action")
    }
}
module.exports = {
    isAdmin, isCompanyMember, isCompanyManager, 
    isProjectMember, isProjectManager, checkPermit
}
