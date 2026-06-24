const request = require("supertest");
const app = require("../server");
const expect = require("chai").expect;

let adminToken;
let userToken;
let testUserId;

describe("User Management Access Control Tests", () => {

  /**
   * LOGIN ADMIN
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
        adminToken = res.body.token;

        done();
      });
  });

  /**
   * CREATE NORMAL USER
   */
  before((done) => {

    request(app)
      .post("/api/users")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test User",
        email: `testuser${Date.now()}@test.com`,
        password: "123456",
        role: "user",
        isActive: true
      })
      .end((err, res) => {

        expect(res.status).to.be.oneOf([200, 201]);
        testUserId = res.body._id;

        done();
      });
  });

  /**
   * LOGIN NORMAL USER (CRITICAL FIX)
   */
  before((done) => {

    request(app)
      .post("/api/auth/login")
      .send({
        email: "testuser@test.com", // ⚠️ adjust if needed
        password: "123456"
      })
      .end((err, res) => {

        userToken = res.body.token;
        done();
      });
  });

  /**
   * 1. NON-ADMIN VIEW USERS → SHOULD FAIL
   */
  it("should restrict non-admin user from viewing all users", (done) => {

    request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`)
      .end((err, res) => {

        expect(res.status).to.equal(403);

        done();
      });
  });

  /**
   * 2. NON-ADMIN ROLE CHANGE → SHOULD FAIL
   */
  it("should restrict non-admin user from updating user role", (done) => {

    request(app)
      .put(`/api/users/${testUserId}/role`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ role: "admin" })
      .end((err, res) => {

        expect(res.status).to.equal(403);

        done();
      });
  });

  /**
   * 3. NON-ADMIN STATUS CHANGE → SHOULD FAIL
   */
  it("should restrict non-admin user from updating user status", (done) => {

    request(app)
      .put(`/api/users/${testUserId}/status`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ isActive: false })
      .end((err, res) => {

        expect(res.status).to.equal(403);

        done();
      });
  });

});
