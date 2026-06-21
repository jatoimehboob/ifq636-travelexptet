const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../server');

describe('Auth API Tests', () => {

  let token;

  it('should login user and return JWT token', (done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        email: 'david@test.com',
        password: 'Password123'
      })
      .end((err, res) => {

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');

        token = res.body.token;

        done();
      });
  });

  it('should get user profile with valid token', (done) => {
    request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('email');

        done();
      });
  });

});
