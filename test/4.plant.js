process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')

let managerUser = '' // Save user login tokenkey
let employeeUser = ''
let notPermitUser = ''
let project = ''
let listPlants = '' // Use to update, delete this company with Id
let userIds // Array user will add to plant

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

describe('POST /plant', () => {
    it('OK, create Plant 1', done => {
        request(app).post('/plant')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Plant 1', description: 'Plant 1 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                expect(body.plant.title).to.equals('Plant 1')
                expect(body.plant.description).to.equals('Plant 1 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Plant 2', done => {
        request(app).post('/plant')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Plant 2', description: 'Plant 2 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                expect(body.plant.title).to.equals('Plant 2')
                expect(body.plant.description).to.equals('Plant 2 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Plant 3', done => {
        request(app).post('/plant')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Plant 3', description: 'Plant 3 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                expect(body.plant.title).to.equals('Plant 3')
                expect(body.plant.description).to.equals('Plant 3 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Plant 4', done => {
        request(app).post('/plant')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Plant 4', description: 'Plant 4 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                expect(body.plant.title).to.equals('Plant 4')
                expect(body.plant.description).to.equals('Plant 4 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create Plant 5', done => {
        request(app).post('/plant')
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Plant 5', description: 'Plant 5 Description', projectId: project._id })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                expect(body.plant.title).to.equals('Plant 5')
                expect(body.plant.description).to.equals('Plant 5 Description')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, not permistion', done => {
        request(app).post('/plant')
            .set({ 'x-access-token': notPermitUser.tokenKey })
            .send({ title: 'Plant Fail', description: 'Plant Fail Description', projectId: project._id })
            .then(res => {
                expect(res.statusCode).to.equals(403)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /plant?projectId=', () => {
    it('OK, Query list of plants', done => {
        request(app).get(`/plant?projectId=${project._id}`)
            .set({ 'x-access-token': employeeUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plants')
                expect(body.plants.length).to.equals(5)
                listPlants = body.plants
                done()
            })
            .catch((error) => done(error))
    })
})

describe('PUT /plant/:plantId/', () => {
    it('OK, edit plant', done => {
        request(app).put(`/plant/${listPlants[0]._id}/`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({ title: 'Plant Edit', description: 'Description Edit'})
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /plant/:plantId/move-to-trash', () => {
    it('OK, move to trash plant', done => {
        request(app).post(`/plant/${listPlants[0]._id}/move-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /plant/:plantId/unmove-to-trash', () => {
    it('OK, unmove to trash plant', done => {
        request(app).post(`/plant/${listPlants[0]._id}/unmove-to-trash`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /plant/:plantId/hidden', () => {
    it('OK, hidden plant', done => {
        request(app).post(`/plant/${listPlants[0]._id}/hidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /plant/:plantId/unhidden', () => {
    it('OK, unhidden plant', done => {
        request(app).post(`/plant/${listPlants[0]._id}/unhidden`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .then(res => {
                const body = res.body
                expect(res.statusCode).to.equals(200)
                expect(body).to.contain.property('plant')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('DELETE /plant/:plantId/delete', () => {
    it('OK, delete plant', done => {
        request(app).delete(`/plant/${listPlants[0]._id}/delete`)
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

describe('POST /plant/:plantId/add-members', () => {
    it('OK, add members to plant', done => {
        request(app).post(`/plant/${listPlants[1]._id}/add-members`)
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

describe('POST /plant/:plantId/remove-member', () => {
    it('OK, remove member to plant', done => {
        request(app).post(`/plant/${listPlants[1]._id}/remove-member`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1]})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /plant/:plantId/change-user-role', () => {
    it('OK, change user role', done => {
        request(app).post(`/plant/${listPlants[1]._id}/change-user-role`)
            .set({ 'x-access-token': managerUser.tokenKey })
            .send({userId: userIds[1], role: 'manager'})
            .then(res => {
                expect(res.statusCode).to.equals(200)
                done()
            })
            .catch((error) => done(error))
    })
})

