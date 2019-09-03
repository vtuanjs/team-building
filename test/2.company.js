process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')

const database = require('../database/database')
const app = require('../app')

let signedUserTokenKey = ''
let companyIdEdited = '' // Use to update, delete this company with Id

describe('POST /auth/login', () => {
    it('Ok, login admin again', done => {
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

describe('POST /company', () => {
    it('OK, create new company with emaildomain amavi.asia', done => {
        request(app).post('/company')
            .set({'x-access-token': signedUserTokenKey})
            .send({ name: 'Company AMAVI', emailDomain: 'amavi.asia', address: 'Ho Chi Minh City, Vietnam' })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('company')
                expect(body.company.name).to.equals('Company AMAVI')
                expect(body.company.emailDomain).to.equals('amavi.asia')
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, duplicate email domain', done => {
        request(app).post('/company')
            .set({'x-access-token': signedUserTokenKey})
            .send({ name: 'Company AMAVI', emailDomain: 'amavi.asia', address: 'Ho Chi Minh City, Vietnam' })
            .then(res => {
                expect(res.statusCode).to.equals(400)
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, wrong email domain format', done => {
        request(app).post('/company')
            .set({'x-access-token': signedUserTokenKey})
            .send({ name: 'Company AMAVI', emailDomain: 'amaviasia', address: 'Ho Chi Minh City, Vietnam' })
            .then(res => {
                expect(res.statusCode).to.equals(400)
                done()
            })
            .catch((error) => done(error))
    })
})