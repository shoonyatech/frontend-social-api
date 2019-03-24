import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../../server";

chai.use(chaiHttp);

describe("base route", () => {
  it("Should return response with status 200", done => {
    chai
      .request(server)
      .get("/")
      .end((err, res) => {
        expect(res.status).equals(200);
        done();
      });
  });
});
