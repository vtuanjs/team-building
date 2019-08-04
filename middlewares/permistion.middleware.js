const checkAdmin = (user) => {
    return user.role === "admin"
}

const checkCompanyMember = (user, companyId) => {
    return user.company.id && user.company.id.equals(companyId)
}

const checkCompanyManager = (user, companyId) => {
    return user.company.id && user.company.id.equals(companyId) &&
        user.company.role === "manager"
}

const checkProjectMember = (user, projectId) => {
    return user.projects.some(item => (item.id.equals(projectId)))
}

const checkProjectManager = (user, projectId) => {
    return user.projects.some(item => (item.id.equals(projectId) &&
        item.role === "manager"))
}

const checkPermit = (...checks) => {
    return (next) => {
        // Call next if any check passes:
        for (let i = 0; i < checks.length; i++) {
            if (checks[i]) return next();
        }
        next("You don't have authorization to do this action")
    }
}
module.exports = {
    checkAdmin, checkCompanyMember, checkCompanyManager, 
    checkProjectMember, checkProjectManager, checkPermit
}
