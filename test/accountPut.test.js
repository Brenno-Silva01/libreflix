const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../app'); 
const User = require('../models/User'); 
const expect = chai.expect;

chai.use(chaiHttp);

describe('Teste do método accountPut', () => {
  let userStub;

  beforeEach(() => {
    // Cria um stub para simular o método findById
    userStub = sinon.stub(User, 'findById');
  });

  afterEach(() => {
    // Restaura os métodos originais
    sinon.restore();
  });

  it('password presente, válido e confirmado', (done) => {
    const mockUser = { save: sinon.stub().yields(null) };
    userStub.yields(null, mockUser);

    chai
      .request(app)
      .put('/account')
      .send({ password: '1234', confirm: '1234' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(mockUser.save.calledOnce).to.be.true;
        done();
      });
  });

  it('password ausente', (done) => {
    chai
      .request(app)
      .put('/account')
      .send({ email: 'user@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.include('Este e-mail não é válido.');
        done();
      });
  });

  it('password presente, mas muito curta', (done) => {
    chai
      .request(app)
      .put('/account')
      .send({ password: '123', confirm: '123' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.include('A senha precisa ter pelo menos 4 caracteres.');
        done();
      });
  });

  it('password presente, mas confirmação falha', (done) => {
    chai
      .request(app)
      .put('/account')
      .send({ password: '1234', confirm: '12345' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.include('As senhas inseridas não conferem.');
        done();
      });
  });

  it('Erro no e-mail', (done) => {
    chai
      .request(app)
      .put('/account')
      .send({ email: 'email_invalido' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.include('Este e-mail não é válido.');
        done();
      });
  });

  it('E-mail vazio', (done) => {
    chai
      .request(app)
      .put('/account')
      .send({ email: '' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.include('O campo "Email" precisa ser preenchido.');
        done();
      });
  });

  it('Erro de duplicidade', (done) => {
    const mockUser = { save: sinon.stub().yields({ code: 11000 }) };
    userStub.yields(null, mockUser);

    chai
      .request(app)
      .put('/account')
      .send({ password: '1234', confirm: '1234' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.text).to.include('E-mail ou username inseridos já estão associados com outra conta.');
        done();
      });
  });

  it('Atualização de perfil com sucesso', (done) => {
    const mockUser = { save: sinon.stub().yields(null) };
    userStub.yields(null, mockUser);

    chai
      .request(app)
      .put('/account')
      .send({
        email: 'user@example.com',
        username: 'user',
        name: 'User Name',
        location: 'User Location',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(mockUser.save.calledOnce).to.be.true;
        done();
      });
  });
});
