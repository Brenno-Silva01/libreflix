const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const User = require('../models/User'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe("Teste de validação do campo Local", () => {
  it("Deve permitir salvar um país válido", (done) => {
    chai.request(app)
      .put("/account")
      .send({ location: "Brasil" }) 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("success").equal("Local salvo com sucesso.");
        done();
      });
  });

  it("Não deve permitir salvar um país inválido", (done) => {
    chai.request(app)
      .put("/account")
      .send({ location: "País Inexistente" }) 
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("error").equal("Local inválido. Insira um país válido.");
        done();
      });
  });

  it("Deve retornar erro se a lista de locais válidos estiver vazia", (done) => {
    chai.request(app)
      .put("/account")
      .send({ location: "Brasil" })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property("error").equal("Lista de locais inválida ou vazia.");
        done();
      });
  });
});