const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../server');

describe('User Management Access Control Tests', () => {
  let userToken;

  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        email: 'david@test.com',
        password: 'Password123'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        userToken = res.body.token;
        done();
      });
  });

  it('should restrict non-admin user from viewing all users', (done) => {
    request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`)
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('should restrict non-admin user from updating user role', (done) => {
    request(app)
      .put('/api/users/000000000000000000000000/role')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ role: 'admin' })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });

  it('should restrict non-admin user from updating user status', (done) => {
    request(app)
      .put('/api/users/000000000000000000000000/status')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ isActive: false })
      .end((err, res) => {
        expect(res.status).to.equal(403);
        done();
      });
  });
});
