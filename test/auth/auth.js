const expect = require('chai').expect
const request = require('supertest')

const database = require('../../database/database')
const app = require('../../app')

describe('POST /auth/login', () => {
    before(done => {
        database.connect()
            .then(() => done())
            .catch((error) => done(error));
    })

    after(done => {
        database.close()
            .then(() => done())
            .catch((error) => done(error));
    })

    it('OK, login now', done => {
        request(app).post('/auth/login')
            .send({ email: 'vantuan130393@gmail.com', password: "12345678" })
            .then(res => {
                const body = res.body
                expect(body).to.contain.property('user')
                expect({
                    'body.user.email': 'vantuan130393@gmail.com'
                })
                done()
            })
            .catch((error) => done(error))
    });

    it('Fail, wrong email', (done) => {
        request(app).post('/auth/login')
            .send({ email: 'wrong email', password: '12345678' })
            .then(res => {
                expect({
                    'body.message': /^Unauthorized/
                })
                done()
            })
            .catch((error) => done(error))
    })

    it('Fail, wrong password', done => {
        request(app).post('/auth/login')
            .send({ email: 'vantuan130393@gmail.com', password: 'wrong password' })
            .then(res => {
                expect({
                    'body.message': /^Unauthorized/
                })
                done()
            })
            .catch(error => done(error))
    })
})