process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')

let managerUser = '' // Save user login tokenkey
let employeeUser = ''
let notPermitUser = ''
let project = ''
let job = ''
let listSubJobs = '' // Use to update, delete this company with Id
let userIds // Array user will add to subJob

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
    it('Ok, login employee job account', done => {
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

describe('GET /groupJob?projectId=', () => {
    it('OK, Query list of groupJobs', done => {
        request(app).get(`/groupJob?projectId=${project._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('groupJobs')
                groupJob = body.groupJobs[0]
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /job?groupJobId=', () => {
    it('OK, Query list of jobs', done => {
        request(app).get(`/job?groupJobId=${groupJob._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('jobs')
                job = body.jobs[0]
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /subJob', () => {
    it('OK, create SubJob 1', done => {
        request(app).post('/subJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'SubJob 1', description: 'SubJob 1 Description', jobId: job._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                expect(body.subJob.title).to.equals('SubJob 1')
                expect(body.subJob.description).to.equals('SubJob 1 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create SubJob 2', done => {
        request(app).post('/subJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'SubJob 2', description: 'SubJob 2 Description', jobId: job._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                expect(body.subJob.title).to.equals('SubJob 2')
                expect(body.subJob.description).to.equals('SubJob 2 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create SubJob 3', done => {
        request(app).post('/subJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'SubJob 3', description: 'SubJob 3 Description', jobId: job._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                expect(body.subJob.title).to.equals('SubJob 3')
                expect(body.subJob.description).to.equals('SubJob 3 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create SubJob 4', done => {
        request(app).post('/subJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'SubJob 4', description: 'SubJob 4 Description', jobId: job._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                expect(body.subJob.title).to.equals('SubJob 4')
                expect(body.subJob.description).to.equals('SubJob 4 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create SubJob 5', done => {
        request(app).post('/subJob')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'SubJob 5', description: 'SubJob 5 Description', jobId: job._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                expect(body.subJob.title).to.equals('SubJob 5')
                expect(body.subJob.description).to.equals('SubJob 5 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, not permistion', done => {
        request(app).post('/subJob')
            .set({ 'x-access-token': notPermitUser.tokenKey })
            .send({ title: 'SubJob Fail', description: 'SubJob Fail Description', jobId: job._id })
            .then(res => {
                expect(res.statusCode).to.equals(403)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /subJob?jobId=', () => {
    it('OK, Query list of subJobs', done => {
        request(app).get(`/subJob?jobId=${job._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJobs')
                expect(body.subJobs.length).to.equals(5)
                listSubJobs = body.subJobs
                done()
            })
            .catch((error) => done(error))
    })
})

describe('PUT /subJob/:subJobId/', () => {
    it('OK, move to trash subJob', done => {
        request(app).put(`/subJob/${listSubJobs[0]._id}/`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'SubJob Edit', description: 'Description Edit'})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /subJob/:subJobId/move-to-trash', () => {
    it('OK, move to trash subJob', done => {
        request(app).post(`/subJob/${listSubJobs[0]._id}/move-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /subJob/:subJobId/unmove-to-trash', () => {
    it('OK, unmove to trash subJob', done => {
        request(app).post(`/subJob/${listSubJobs[0]._id}/unmove-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /subJob/:subJobId/hidden', () => {
    it('OK, hidden subJob', done => {
        request(app).post(`/subJob/${listSubJobs[0]._id}/hidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /subJob/:subJobId/unhidden', () => {
    it('OK, unhidden subJob', done => {
        request(app).post(`/subJob/${listSubJobs[0]._id}/unhidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('subJob')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('DELETE /subJob/:subJobId/delete', () => {
    it('OK, delete subJob', done => {
        request(app).delete(`/subJob/${listSubJobs[0]._id}/delete`)
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

describe('POST /subJob/:subJobId/add-members', () => {
    it('OK, add members to subJob', done => {
        request(app).post(`/subJob/${listSubJobs[1]._id}/add-members`)
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

describe('POST /subJob/:subJobId/remove-member', () => {
    it('OK, remove member', done => {
        request(app).post(`/subJob/${listSubJobs[1]._id}/remove-member`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1]})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /subJob/:subJobId/change-user-role', () => {
    it('OK, change user role', done => {
        request(app).post(`/subJob/${listSubJobs[1]._id}/change-user-role`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1], role: 'manager'})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

