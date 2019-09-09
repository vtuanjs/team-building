const isAllowed = (roleCheck, rolesAllowed) => {
    return rolesAllowed.indexOf(roleCheck) > -1
}

const isUserSelf = () => {
    return (req) => {
        if (req.user && req.user._id.equals(req.params.userId)) return true
        else return false
    }
}

const inUser = (...allowed) => {
    //The manager will have user rights
    if (allowed.indexOf("user") > -1) {
        allowed.push("manager")
    }

    return (req) => {
        if (req.user && isAllowed(req.user.role, allowed)) return true
        else return false
    }
}

const inCompany = (compareFrom, ...allowed) => {
    if (allowed.indexOf("employee") > -1) {
        allowed.push("manager")
    }

    return (req) => {
        const signedUser = req.user
        let companyId
        switch (compareFrom) {
            case "body":
                companyId = req.body.companyId
                break;
            case "params":
                companyId = req.params.companyId
                break;
            case "query":
                companyId = req.query.companyId
                break;
            default:
                companyId = signedUser.company.id
                break;
        }

        if (signedUser && signedUser.company.id && signedUser.company.role && signedUser.company.id.equals(companyId)
            && isAllowed(signedUser.company.role, allowed))
            return true

        return false
    }
}

const inProject = (compareFrom, ...allowed) => {
    if (allowed.indexOf("employee") > -1) {
        allowed.push("manager")
    }
    
    return (req, _res) => {
        const signedUser = req.user

        let projectId
        switch (compareFrom) {
            case "body":
                projectId = req.body.projectId
                break;
            case "params":
                projectId = req.params.projectId
                break;
            case "query":
                projectId = req.query.projectId
                break;
            default:
                break;
        }

        if (signedUser && signedUser.projects
            && signedUser.projects.some(project => {
                return project.id.equals(projectId)
                    && isAllowed(project.role, allowed)
            })) return true

        return false
    }
}

const inPlant = (compareFrom, ...allowed) => {
    
    if (allowed.indexOf("employee") > -1) {
        allowed.push("manager")
    }
    
    return (req, _res) => {
        const signedUser = req.user
        let plantId
        switch (compareFrom) {
            case "body":
                plantId = req.body.plantId
                break;
            case "params":
                plantId = req.params.plantId
                break;
            case "query":
                plantId = req.query.plantId
                break;
            default:
                break;
        }

        if (signedUser && signedUser.plants
            && signedUser.plants.some(plant => {
                return plant.id.equals(plantId)
                    && isAllowed(plant.role, allowed)
            })) return true

        return false
    }
}

const inJob = (compareFrom, ...allowed) => {
    
    if (allowed.indexOf("employee") > -1) {
        allowed.push("manager")
    }
    
    return (req, _res) => {
        const signedUser = req.user
        let jobId
        switch (compareFrom) {
            case "body":
                jobId = req.body.jobId
                break;
            case "params":
                jobId = req.params.jobId
                break;
            case "query":
                jobId = req.query.jobId
                break;
            default:
                break;
        }

        if (signedUser && signedUser.jobs
            && signedUser.jobs.some(job => {
                return job.id.equals(jobId)
                    && isAllowed(job.role, allowed)
            })) return true

        return false
    }
}

const checkPermit = (...checks) => {   
    return (req, res, next) => {
        for (let i = 0; i < checks.length; i++) {
            if (checks[i](req, res, next)) {
                return next()
            }
        }
        return res.status(403).json({
            message: "You don't have authorization to do this action!"
        })
    }
}

module.exports = {
    isUserSelf,
    inUser,
    inCompany,
    inProject,
    inPlant,
    inJob,
    checkPermit
}