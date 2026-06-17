const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

let token = "";
let expenseId = "";

describe("Expense API Tests", () => {

  // Login first to get token
  before((done) => {
    chai.request(server)
      .post("/api/auth/login")
      .send({
        email: "david@test.com",
        password: "Password123"
      })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it("should create an expense", (done) => {
    chai.request(server)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Hotel Booking",
        amount: 200,
        category: "Accommodation",
        paymentMethod: "Card",
        date: "2025-06-17",
        description: "Test expense"
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expenseId = res.body._id;
        done();
      });
  });

  it("should get all expenses", (done) => {
    chai.request(server)
      .get("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        done();
      });
  });

  it("should update expense", (done) => {
    chai.request(server)
      .put(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Hotel",
        amount: 300
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  it("should delete expense", (done) => {
    chai.request(server)
      .delete(`/api/expenses/${expenseId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

});
