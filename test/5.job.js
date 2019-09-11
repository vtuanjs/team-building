process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')

let managerUser = '' // Save user login tokenkey
let employeeUser = ''
let notPermitUser = ''
let project = ''
let groupJob = ''
let listJobs = '' // Use to update, delete this company with Id
let userIds // Array user will add to job

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
    it('Ok, login employee groupJob account', done => {
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

describe('POST /job', () => {
    it('OK, create Job 1', done => {
        request(app).post('/job')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Job 1', description: 'Job 1 Description', groupJobId: groupJob._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                expect(body.job.title).to.equals('Job 1')
                expect(body.job.description).to.equals('Job 1 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Job 2', done => {
        request(app).post('/job')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Job 2', description: 'Job 2 Description', groupJobId: groupJob._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                expect(body.job.title).to.equals('Job 2')
                expect(body.job.description).to.equals('Job 2 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Job 3', done => {
        request(app).post('/job')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Job 3', description: 'Job 3 Description', groupJobId: groupJob._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                expect(body.job.title).to.equals('Job 3')
                expect(body.job.description).to.equals('Job 3 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Job 4', done => {
        request(app).post('/job')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Job 4', description: 'Job 4 Description', groupJobId: groupJob._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                expect(body.job.title).to.equals('Job 4')
                expect(body.job.description).to.equals('Job 4 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Job 5', done => {
        request(app).post('/job')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Job 5', description: 'Job 5 Description', groupJobId: groupJob._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                expect(body.job.title).to.equals('Job 5')
                expect(body.job.description).to.equals('Job 5 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, not permistion', done => {
        request(app).post('/job')
            .set({ 'x-access-token': notPermitUser.tokenKey })
            .send({ title: 'Job Fail', description: 'Job Fail Description', groupJobId: groupJob._id })
            .then(res => {
                expect(res.statusCode).to.equals(403)
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
                expect(body.jobs.length).to.equals(5)
                listJobs = body.jobs
                done()
            })
            .catch((error) => done(error))
    })
})

describe('PUT /job/:jobId/', () => {
    it('OK, move to trash job', done => {
        request(app).put(`/job/${listJobs[0]._id}/`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Job Edit', description: 'Description Edit'})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /job/:jobId/move-to-trash', () => {
    it('OK, move to trash job', done => {
        request(app).post(`/job/${listJobs[0]._id}/move-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /job/:jobId/unmove-to-trash', () => {
    it('OK, unmove to trash job', done => {
        request(app).post(`/job/${listJobs[0]._id}/unmove-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /job/:jobId/hidden', () => {
    it('OK, hidden job', done => {
        request(app).post(`/job/${listJobs[0]._id}/hidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /job/:jobId/unhidden', () => {
    it('OK, unhidden job', done => {
        request(app).post(`/job/${listJobs[0]._id}/unhidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('job')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('DELETE /job/:jobId/delete', () => {
    it('OK, delete job', done => {
        request(app).delete(`/job/${listJobs[0]._id}/delete`)
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

describe('POST /job/:jobId/add-members', () => {
    it('OK, add members to job', done => {
        request(app).post(`/job/${listJobs[1]._id}/add-members`)
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

describe('POST /job/:jobId/remove-member', () => {
    it('OK, remove member', done => {
        request(app).post(`/job/${listJobs[1]._id}/remove-member`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1]})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /job/:jobId/change-user-role', () => {
    it('OK, change user role', done => {
        request(app).post(`/job/${listJobs[1]._id}/change-user-role`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1], role: 'manager'})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

