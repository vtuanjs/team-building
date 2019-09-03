process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')

const database = require('../database/database')
const app = require('../app')

module.exports.signedUserTokenKey = '' // Save token key after login
let userIdEdited = '' // Use to update, delete this userId

describe('POST /user', () => {
    before(done => {
        database.connect()
            .then(() => done())
            .catch((error) => done(error));
    })

    it('OK, create new user with email dung.van@gmail.com', done => {
        request(app).post('/user')
            .send({ name: 'Nguyen Van Dung', email: 'dung.van@gmail.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user.name).to.equals('Nguyen Van Dung')
                expect(body.user.email).to.equals('dung.van@gmail.com')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create new user with email kien.tran@hot.com', done => {
        request(app).post('/user')
            .send({ name: 'Luck', email: 'luck@hot.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user.name).to.equals('Luck')
                expect(body.user.email).to.equals('luck@hot.com')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create new user with email smith@exo.com', done => {
        request(app).post('/user')
            .send({ name: 'Smith', email: 'smith@exo.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user.name).to.equals('Smith')
                expect(body.user.email).to.equals('smith@exo.com')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, create new user with email ngocancsdl@gmail.com', done => {
        request(app).post('/user')
            .send({ name: 'Lê Thị Ngọc An', email: 'ngocancsdl@gmail.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user.name).to.equals('Lê Thị Ngọc An')
                expect(body.user.email).to.equals('ngocancsdl@gmail.com')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, duplicate email', done => {
        request(app).post('/user')
            .send({ name: 'Nguyen Van Dung', email: 'dung.van@gmail.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('message')
                expect(body).to.not.contain.property('user')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, wrong email format', done => {
        request(app).post('/user')
            .send({ name: 'Taylor Swift', email: 'taylorgmail.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('message')
                expect(body).to.not.contain.property('user')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, missing email', done => {
        request(app).post('/user')
            .send({ name: 'Taylor Swift', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('message')
                expect(body).to.not.contain.property('user')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, missing password', done => {
        request(app).post('/user')
            .send({ name: 'Taylor Swift', email: 'taylorgmail.com' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('message')
                expect(body).to.not.contain.property('user')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('GET /user', () => {
    it('OK, get list users', done => {
        request(app).get('/user')
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('users')
                expect(body.users.length).to.equals(4)
                done()
            })
            .catch(error => done(error))
    })
})

describe('GET /user/:email', () => {
    it('OK, find user by email', done => {
        request(app).get('/user/find-by-email/' + "smith@exo.com")
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                userIdEdited = body.user._id
                // Save userId to global variable and use it to get detail, update, delete user
                done()
            })
            .catch(error => done(error))
    })
})

describe('GET /user/:userId', () => {
    it('OK, get detail user', done => {
        request(app).get('/user/' + userIdEdited)
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user).to.contain.property('name')
                expect(body.user).to.contain.property('email')
                done()
            })
            .catch(error => done(error))
    })
})

describe('POST /user/admin', () => {
    it('OK, create admin with email vantuan130393@gmail.com', done => {
        request(app).post('/user/admin')
            .send({ name: 'Nguyễn Văn Tuấn', email: 'vantuan130393@gmail.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user.name).to.equals('Nguyễn Văn Tuấn')
                expect(body.user.email).to.equals('vantuan130393@gmail.com')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, only create admin once time', done => {
        request(app).post('/user/admin')
            .send({ name: 'Admin 2', email: 'admin2@gmail.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('message')
                expect(body).to.not.contain.property('user')
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /auth/login', () => {
    it('Ok, login admin user', done => {
        request(app).post(`/auth/login`)
            .send({ email: 'vantuan130393@gmail.com', password: '12345678' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user).to.contain.property('tokenKey')
                signedUserTokenKey = body.user.tokenKey
                // Save token key to global variable and use it in other test
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /user/admin/:userIds/block', () => {
    it('OK, block user by admin', done => {
        request(app).post(`/user/admin/${userIdEdited}/block`)
            .set({ "x-access-token": signedUserTokenKey })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('raw')
                expect(body.raw.ok).to.greaterThan(0)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('POST /user/admin/:userIds/unlock', () => {
    it('OK, unlock user by admin', done => {
        request(app).post(`/user/admin/${userIdEdited}/unlock`)
            .set({ "x-access-token": signedUserTokenKey })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('raw')
                expect(body.raw.ok).to.greaterThan(0)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('PUT /user/:userId', () => {
    it('OK, update user by admin', done => {
        request(app).put(`/user/${userIdEdited}`)
            .set({ "x-access-token": signedUserTokenKey })
            .send({
                name: 'Smith',
                gender: 'male',
                phone: '0335578022',
                address: 'Ho Chi Minh'
            })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user.name).to.equals('Smith')
                expect(body.user.gender).to.equals('male')
                expect(body.user.phone).to.equals('0335578022')
                expect(body.user.address).to.equals('Ho Chi Minh')
                done()
            })
            .catch((error) => done(error))
    })

    it('OK, update user with change password', done => {
        request(app).put(`/user/${userIdEdited}`)
            .set({ "x-access-token": signedUserTokenKey })
            .send({
                name: 'Smith',
                gender: 'male',
                phone: '0335578022',
                address: 'Ho Chi Minh',
                password: '12345678new',
                oldPassword: '12345678'
            })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect(body.user.name).to.equals('Smith')
                expect(body.user.gender).to.equals('male')
                expect(body.user.phone).to.equals('0335578022')
                expect(body.user.address).to.equals('Ho Chi Minh')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, update user wrong old password', done => {
        request(app).put(`/user/${userIdEdited}`)
            .set({ "x-access-token": signedUserTokenKey })
            .send({
                name: 'Smith',
                gender: 'male',
                phone: '0335578022',
                address: 'Ho Chi Minh',
                password: '1234567',
                oldPassword: '12345678'
            })
            .then(res => {
                expect(res.statusCode).to.equals(400)
                done()
            })
            .catch((error) => done(error))
    })
})

describe('DELETE /user/admin/:userIds/', () => {
    it('OK, delete user by admin', done => {
        request(app).delete(`/user/admin/${userIdEdited}/`)
            .set({ "x-access-token": signedUserTokenKey })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('raw')
                expect(body.raw.ok).to.greaterThan(0)
                done()
            })
            .catch((error) => done(error))
    })
})