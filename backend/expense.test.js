const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../server');

describe('Expense API Tests', () => {

  let token;
  let expenseId;

  // -------------------------
  // LOGIN FIRST
  // -------------------------
  before((done) => {
    request(app)
      .post('/api/auth/login')
      .send({
        email: 'david@test.com',
        password: 'Password123'
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  // -------------------------
  // CREATE EXPENSE
  // -------------------------
  it('should create an expense', (done) => {
    request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Expense',
        amount: 100,
        category: 'Food'
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expenseId = res.body._id;
        done();
      });
  });

  // -------------------------
  // GET EXPENSES
  // -------------------------
  it('should get all expenses', (done) => {
    request(app)
      .get('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  // -------------------------
  // DELETE EXPENSE
  // -------------------------
  it('should delete an expense', (done) => {
    request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

});
