const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')

let employeeUser = ''
let project = ''
let groupJob = ''
let job = ''
let listComment = '' // Use to update, delete this company with Id

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
            .set({ 'x-access-token': employeeUser.tokenKey })
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

describe('POST /comment', () => {
    it('OK, create comment 1', done => {
        request(app).post(`/comment`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .send({body: 'Comment 1', jobId: job._id})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('comment')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create comment 2', done => {
        request(app).post(`/comment`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .send({body: 'Comment 2', jobId: job._id})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('comment')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create comment 3', done => {
        request(app).post(`/comment`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .send({body: 'Comment 3', jobId: job._id})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('comment')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create comment 4', done => {
        request(app).post(`/comment`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .send({body: 'Comment 4', jobId: job._id})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('comment')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /comment?jobId=', () => {
    it('OK, get all comment in job', done => {
        request(app).get(`/comment?jobId=${job._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('comments')
                listComment = body.comments
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /comment/:commentId', () => {
    it('OK, get detail comment', done => {
        request(app).get(`/comment/${listComment[0]._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('comment')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('PUT /comment/:commentId', () => {
    it('OK, edit comment comment', done => {
        request(app).put(`/comment/${listComment[0]._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .send({body: 'Comment Edited'})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('comment')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('DELETE /comment/:commentId', () => {
    it('OK, delete comment comment', done => {
        request(app).delete(`/comment/${listComment[0]._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})


