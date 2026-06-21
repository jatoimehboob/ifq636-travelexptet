const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

const app = require('../server');

describe('Category API Tests', () => {

  let categoryId;
  const categoryName = `TestCategory_${Date.now()}`;

  it('should create a category', (done) => {
    request(app)
      .post('/api/categories')
      .send({
        name: categoryName,
        description: 'Created by automated test'
      })
      .end((err, res) => {
        console.log('CREATE CATEGORY:', res.status, res.body);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('_id');

        categoryId = res.body._id;
        done();
      });
  });

  it('should get all categories', (done) => {
    request(app)
      .get('/api/categories')
      .end((err, res) => {
        console.log('GET CATEGORIES:', res.status);

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');

        done();
      });
  });

  it('should update a category', (done) => {
    request(app)
      .put(`/api/categories/${categoryId}`)
      .send({
        name: `${categoryName}_Updated`,
        description: 'Updated category'
      })
      .end((err, res) => {
        console.log('UPDATE CATEGORY:', res.status, res.body);

        expect(res.status).to.equal(200);

        done();
      });
  });

  it('should delete a category', (done) => {
    request(app)
      .delete(`/api/categories/${categoryId}`)
      .end((err, res) => {
        console.log('DELETE CATEGORY:', res.status, res.body);

        expect(res.status).to.equal(200);

        done();
      });
  });

});
