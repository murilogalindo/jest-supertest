const { default: expect } = require('expect')
const request = require('supertest')
const baseURLAc = 'https://demoqa.com/Account/v1';
const baseURLBo = 'https://demoqa.com/BookStore/v1';
//gerar números randomicos com 4 dígitos
const random = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
let userID; // variável que guardará o userId
let username; //variável que guardará o nome de usuário usado na criação de usuário
let token; //variável para guardar o token gerado no Genreate Token

describe('Teste de Criar usuário', () => {
  it('deve criar um usuário com nome e password', async () => {
    const resposta = await request(baseURLAc)
      .post('/User')
      .send({
        userName: `Fabricio${random}`,
        password: '@Fab123456'
      });

      userID = resposta.body.userID
      username = resposta.body.username
    console.log(resposta.body);
    expect(resposta.status).toBe(201); 
    console.log("userID", userID)
  });
});

describe('Teste de geração de token', () => {
    it('deve gerar  um token de autenticação', async () => {
      const resposta = await request(baseURLAc)
        .post('/GenerateToken')
        .send({
          userName: `${username}`,
          password: '@Fab123456'
        });
  
        token = resposta.body.token
      console.log(resposta.body);
      expect(resposta.status).toBe(200); 
      console.log("token", token)
    });
  });
  
  describe('Teste de autorização', () => {
    it('deve verificar se o usuário está autorizado', async () => {
      const resposta = await request(baseURLAc)
        .post('/Authorized')
        .send({
          userName: `${username}`,
          password: '@Fab123456'
        });
  
      console.log(resposta.body);
      expect(resposta.status).toBe(200); 

    });
  });
  describe('Teste de List Books', () => {
    it('deve listar todos os books do sistema', async () => {
      const resposta = await request(baseURLBo)
        .get('/Books')
        
      console.log(resposta.body);
      expect(resposta.status).toBe(200); 
    });
  });
  describe('Teste de Book Store', () => {
    it('deve verificar se o usuário está autorizado', async () => {
      const resposta = await request(baseURLBo)
      .post('/Books')
      .set('Authorization', `Bearer ${token}`) //Bearer Token
      .send({
        userId: `${userID}`,
        collectionOfIsbns: [
          { isbn: '9781449365035' },
          { isbn: '9781491904244' }
        ]
      });
      console.log("token", token)
      console.log(resposta.body);
      expect(resposta.status).toBe(201); 
    });
  });
  describe('Teste de List Detail Books', () => {
    it('deve listar todos os books de  um usuário', async () => {
      const resposta = await request(baseURLAc)
        .get('/User', `${userID}`)
        
      console.log(resposta.body);
      expect(resposta.status).toBe(200); 

    });
  });