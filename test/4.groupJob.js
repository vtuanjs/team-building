const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')

let managerUser = '' // Save user login tokenkey
let employeeUser = ''
let notPermitUser = ''
let project = ''
let listGroupJobs = '' // Use to update, delete this company with Id
let userIds // Array user will add to groupJob

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
            .send({ email: 'luck@hot.com', password: '12345678b' })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('user')
                expect(body.user).to.contain.property('tokenKey')
                notPermitUser = body.user
                // Save token key to global variable and use it in other test
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /auth/login', () => {
    it('Ok, login employee project account', done => {
        request(app).post(`/auth/login`)
            .send({ email: 'kien.nguyen@amavi.asia', password: '12345678c' })
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

describe('GET /project', () => {
    it('OK, Query list of projects', done => {
        request(app).get('/project')
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('projects')
                project = body.projects[0]
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /groupJob', () => {
    it('OK, create GroupJob 1', done => {
        request(app).post('/groupJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'GroupJob 1', description: 'GroupJob 1 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                expect(body.groupJob.title).to.equals('GroupJob 1')
                expect(body.groupJob.description).to.equals('GroupJob 1 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create GroupJob 2', done => {
        request(app).post('/groupJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'GroupJob 2', description: 'GroupJob 2 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                expect(body.groupJob.title).to.equals('GroupJob 2')
                expect(body.groupJob.description).to.equals('GroupJob 2 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create GroupJob 3', done => {
        request(app).post('/groupJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'GroupJob 3', description: 'GroupJob 3 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                expect(body.groupJob.title).to.equals('GroupJob 3')
                expect(body.groupJob.description).to.equals('GroupJob 3 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create GroupJob 4', done => {
        request(app).post('/groupJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'GroupJob 4', description: 'GroupJob 4 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                expect(body.groupJob.title).to.equals('GroupJob 4')
                expect(body.groupJob.description).to.equals('GroupJob 4 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create GroupJob 5', done => {
        request(app).post('/groupJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'GroupJob 5', description: 'GroupJob 5 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                expect(body.groupJob.title).to.equals('GroupJob 5')
                expect(body.groupJob.description).to.equals('GroupJob 5 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, not permistion', done => {
        request(app).post('/groupJob')
            .set({ 'x-access-token': notPermitUser.tokenKey })
            .send({ title: 'GroupJob Fail', description: 'GroupJob Fail Description', projectId: project._id })
            .then(res => {
                expect(res.statusCode).to.equals(403)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /groupJob?projectId=', () => {
    it('OK, Query list of groupJobs', done => {
        request(app).get(`/groupJob?projectId=${project._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJobs')
                expect(body.groupJobs.length).to.equals(5)
                listGroupJobs = body.groupJobs
                done()
            })
            .catch((error) => done(error))
    })
})

describe('PUT /groupJob/:groupJobId/', () => {
    it('OK, edit groupJob', done => {
        request(app).put(`/groupJob/${listGroupJobs[0]._id}/`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'GroupJob Edit', description: 'Description Edit'})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /groupJob/:groupJobId/move-to-trash', () => {
    it('OK, move to trash groupJob', done => {
        request(app).post(`/groupJob/${listGroupJobs[0]._id}/move-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /groupJob/:groupJobId/unmove-to-trash', () => {
    it('OK, unmove to trash groupJob', done => {
        request(app).post(`/groupJob/${listGroupJobs[0]._id}/unmove-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /groupJob/:groupJobId/hidden', () => {
    it('OK, hidden groupJob', done => {
        request(app).post(`/groupJob/${listGroupJobs[0]._id}/hidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /groupJob/:groupJobId/unhidden', () => {
    it('OK, unhidden groupJob', done => {
        request(app).post(`/groupJob/${listGroupJobs[0]._id}/unhidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('DELETE /groupJob/:groupJobId/delete', () => {
    it('OK, delete groupJob', done => {
        request(app).delete(`/groupJob/${listGroupJobs[0]._id}/delete`)
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

describe('POST /groupJob/:groupJobId/add-members', () => {
    it('OK, add members to groupJob', done => {
        request(app).post(`/groupJob/${listGroupJobs[1]._id}/add-members`)
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

describe('POST /groupJob/:groupJobId/remove-member', () => {
    it('OK, remove member to groupJob', done => {
        request(app).post(`/groupJob/${listGroupJobs[1]._id}/remove-member`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1]})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /groupJob/:groupJobId/change-user-role', () => {
    it('OK, change user role', done => {
        request(app).post(`/groupJob/${listGroupJobs[1]._id}/change-user-role`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1], role: 'manager'})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

