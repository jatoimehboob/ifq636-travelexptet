const chai = require("chai");
const chaiHttp = require("chai-http");

// IMPORTANT: make sure server exports app
const server = require("../server");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Auth API Tests", () => {

  it("should login user and return JWT token", (done) => {
    chai.request(server)
      .post("/api/auth/login")
      .send({
        email: "david@test.com",
        password: "Password123"
      })
      .end((err, res) => {

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        expect(res.body.token).to.be.a("string");

        done();
      });
  });

  it("should get user profile with valid token", (done) => {

    chai.request(server)
      .post("/api/auth/login")
      .send({
        email: "david@test.com",
        password: "Password123"
      })
      .end((err, res) => {

        const token = res.body.token;

        chai.request(server)
          .get("/api/auth/profile")
          .set("Authorization", `Bearer ${token}`)
          .end((err2, res2) => {

            expect(res2).to.have.status(200);
            expect(res2.body).to.have.property("email");

            done();
          });
      });
  });

});
