const request = require("supertest");
const app = require("../server");
const expect = require("chai").expect;

let token;
let categoryId;
let expenseId;

describe("Expense API Tests with Category Integration", () => {

  /**
   * SETUP: LOGIN + CREATE CATEGORY (SEQUENTIAL FIX)
   */
  before((done) => {

    request(app)
      .post("/api/auth/login")
      .send({
        email: "david@test.com",
        password: "Password123"
      })
      .end((err, res) => {

        expect(res.status).to.equal(200);
        token = res.body.token;

        request(app)
          .post("/api/categories")
          .set("Authorization", `Bearer ${token}`)
          .send({
            name: `Test Category ${Date.now()}`,
            description: "Category for expense testing"
          })
          .end((err, res2) => {

            expect(res2.status).to.equal(201);
            categoryId = res2.body._id;

            done();
          });
      });
  });

  /**
   * CREATE EXPENSE
   */
  it("should create an expense using a valid category", (done) => {

    request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Expense",
        amount: 100,
        category: categoryId,
        paymentMethod: "Credit Card",
        date: new Date().toISOString(),
        description: "Expense linked to category test"
      })
      .end((err, res) => {

        console.log("\nCREATE EXPENSE RESPONSE:", res.status, res.body);

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property("_id");

        expenseId = res.body._id;
        done();
      });
  });

  /**
   * GET EXPENSES
   */
  it("should get all expenses", (done) => {

    request(app)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");

        done();
      });
  });

  /**
   * DELETE EXPENSE
   */
  it("should delete the created expense", (done) => {

    request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {

        console.log("\nDELETE EXPENSE RESPONSE:", res.status, res.body);

        expect(res.status).to.equal(200);

        done();
      });
  });

});
