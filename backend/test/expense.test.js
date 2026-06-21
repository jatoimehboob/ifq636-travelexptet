const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../server');

describe('Expense API Tests with Category Integration', () => {
  let token;
  let categoryName;
  let expenseId;

  before((done) => {
    categoryName = `Test Category ${Date.now()}`;

    request(app)
      .post('/api/auth/login')
      .send({
        email: 'david@test.com',
        password: 'Password123'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        token = res.body.token;

        request(app)
          .post('/api/categories')
          .send({
            name: categoryName,
            description: 'Category for expense integration test',
            status: 'Active'
          })
          .end((err2, res2) => {
            expect(res2.status).to.equal(201);
            done();
          });
      });
  });

  it('should create an expense using a valid category', (done) => {
    request(app)
      .post('/api/expenses')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Expense',
        amount: 100,
        category: categoryName,
        paymentMethod: 'Credit Card',
        date: new Date().toISOString(),
        description: 'Expense linked to category test'
      })
      .end((err, res) => {
        console.log('CREATE EXPENSE RESPONSE:', res.status, res.body);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');

        expenseId = res.body._id;
        done();
      });
  });

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

  it('should delete the created expense', (done) => {
    expect(expenseId).to.not.be.undefined;

    request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        console.log('DELETE EXPENSE RESPONSE:', res.status, res.body);

        expect(res.status).to.equal(200);
        done();
      });
  });
});
