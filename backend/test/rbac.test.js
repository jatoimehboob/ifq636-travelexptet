const request = require("supertest");
const app = require("../server");

let userToken;

describe("RBAC Tests", () => {

  /**
   * LOGIN A REAL USER FIRST
   */
  before((done) => {

    request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "Password123"
      })
      .end((err, res) => {

        userToken = res.body.token;
        done();
      });
  });

  /**
   * TEST RBAC PROPERLY
   */
  it("should return 403 for non-admin access", async () => {

    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);

    console.log("\nRBAC OUTPUT");
    console.log("Status:", res.status);
    console.log("Body:", res.body);

    if (res.status !== 403) {
      throw new Error(`Expected 403 but got ${res.status}`);
    }
  });

});
