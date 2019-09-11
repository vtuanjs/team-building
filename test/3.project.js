const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')

let managerUser = '' // Save user login tokenkey
let employeeUser = ''
let listProjects = '' // Use to update, delete this company with Id
let userIds // Array user will add to project

describe('POST /auth/login', () => {
    it('Ok, login manager company account', done => {
        request(app).post(`/auth/login`)
            .send({ email: 'tuan.nv@amavi.asia', password: '12345678c' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('user')
                expect(body.user).to.contain.property('tokenKey')
                managerUser = body.user
                // Save token key to global variable and use it in other test
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /auth/login', () => {
    it('Ok, login employee company account', done => {
        request(app).post(`/auth/login`)
            .send({ email: 'phu.tran@amavi.asia', password: '12345678c' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('user')
                expect(body.user).to.contain.property('tokenKey')
                employeeUser = body.user
                // Save token key to global variable and use it in other test
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project', () => {
    it('OK, create Project 1', done => {
        request(app).post('/project')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Project 1', description: 'Project 1 Description' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                expect(body.project.title).to.equals('Project 1')
                expect(body.project.description).to.equals('Project 1 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Project 2', done => {
        request(app).post('/project')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Project 2', description: 'Project 2 Description' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                expect(body.project.title).to.equals('Project 2')
                expect(body.project.description).to.equals('Project 2 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Project 3', done => {
        request(app).post('/project')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Project 3', description: 'Project 3 Description' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                expect(body.project.title).to.equals('Project 3')
                expect(body.project.description).to.equals('Project 3 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Project 4', done => {
        request(app).post('/project')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Project 4', description: 'Project 4 Description' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                expect(body.project.title).to.equals('Project 4')
                expect(body.project.description).to.equals('Project 4 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Project 5', done => {
        request(app).post('/project')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Project 5', description: 'Project 5 Description' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                expect(body.project.title).to.equals('Project 5')
                expect(body.project.description).to.equals('Project 5 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, not permistion', done => {
        request(app).post('/project')
            .set({ 'x-access-token': employeeUser.tokenKey })
            .send({ title: 'Project Fail', description: 'Project Fail Description' })
            .then(res => {
                expect(res.statusCode).to.equals(403)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /project', () => {
    it('OK, Query list of projects', done => {
        request(app).get('/project')
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('projects')
                expect(body.projects.length).to.equals(5)
                listProjects = body.projects
                done()
            })
            .catch((error) => done(error))
    })
})

describe('PUT /project/:projectId/', () => {
    it('OK, move to trash project', done => {
        request(app).put(`/project/${listProjects[0]._id}/`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Project Edit', description: 'Description Edit'})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/move-to-trash', () => {
    it('OK, move to trash project', done => {
        request(app).post(`/project/${listProjects[0]._id}/move-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/unmove-to-trash', () => {
    it('OK, move to trash project', done => {
        request(app).post(`/project/${listProjects[0]._id}/unmove-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/hidden', () => {
    it('OK, move to trash project', done => {
        request(app).post(`/project/${listProjects[0]._id}/hidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/unhidden', () => {
    it('OK, move to trash project', done => {
        request(app).post(`/project/${listProjects[0]._id}/unhidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/unhidden', () => {
    it('OK, move to trash project', done => {
        request(app).post(`/project/${listProjects[0]._id}/unhidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('project')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/delete', () => {
    it('OK, move to trash project', done => {
        request(app).post(`/project/${listProjects[0]._id}/delete`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /comapny/:companyId/get-users', () => {
    it('OK, get user', done => {
        request(app).get(`/company/${managerUser.company.id}/get-users`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('users')
                userIds = body.users
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/add-members', () => {
    it('OK, add members to project', done => {
        request(app).post(`/project/${listProjects[1]._id}/add-members`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userIds})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/remove-member', () => {
    it('OK, add members to project', done => {
        request(app).post(`/project/${listProjects[1]._id}/remove-member`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1]})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /project/:projectId/change-user-role', () => {
    it('OK, add members to project', done => {
        request(app).post(`/project/${listProjects[1]._id}/change-user-role`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1], role: 'manager'})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

module.exports = { managerUser, employeeUser, listProjects}