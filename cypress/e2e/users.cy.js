import { generateFakeUser,createUser } from '../support/utils';
import { faker } from "@faker-js/faker";

describe('Usuários - Casos de Sucesso', () => {

  let user;
  let userId;

  before(() => {
    user = generateFakeUser();
    createUser({ data: user }).then((response) => {
      userId = response.body.id;
    });
  });

it("Deve buscar um usuário pelo ID", () => {
  
  expect(userId).to.exist;
  cy.log(`Buscando usuário com ID: ${userId}`);

  
  cy.request("GET", `/users/${userId}`).should((response) => {
    console.log("Usuário específico", response);
    
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('id', userId);
    expect(response.body).to.have.property('email', user.email);
  });
});


  it("Deve atualizar os dados de um usuário existente", () => {
    const newName = `QA ${Date.now()}`;
    cy.log(`Updating user ${userId} name to: ${newName}`);

    cy.request("PUT", `/users/${userId}`, { name: newName }).then((response) => {
      console.log("User updated", response);
      expect(response.status).to.eq(200);
      expect(response.body.user).to.have.property('name', newName);
      expect(response.body).to.have.property('message', "User updated successfully.");
    });
  });



it("Deve atualizar os dados de um usuário existente", () => {
  const newName = `QA ${Date.now()}`;
  cy.log(`Atualizando o nome do usuário ${userId} para: ${newName}`);

  cy.request("PUT", `/users/${userId}`, { name: newName }).then((response) => {
    console.log("Usuário atualizado", response);
    expect(response.status).to.eq(200);
    expect(response.body.user).to.have.property('name', newName);
    expect(response.body).to.have.property('message', "User updated successfully.");
  });
});

it("Deve excluir um usuário recém-criado", () => {
    cy.log(`Deleting user with ID: ${userId}`);

    cy.request("DELETE", `/users/${userId}`).then((response) => {
      expect(response.status).to.be.oneOf([200, 204]);
    });
  });
  });

describe('Usuário - Tratamento de Erros', () => {

  it("Não deve permitir a criação de usuários sem nome", () => {
    cy.log('Tentar criar usuario sem nome');

    createUser({
      data: { email: generateFakeUser().email },
      acceptError: true
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields name and email are required.');
    });
  });

  it("Não deve permitir a criação de usuários sem e-mail", () => {
    cy.log('Tentar criar usuario sem email');

    createUser({
      data: { name: generateFakeUser().name },
      acceptError: true
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields name and email are required.');
    });
  });

  it('Não deve permitir a criação de usuários com nome duplicado', () => {
    const name = faker.person.fullName();
    const email1 = faker.internet.email();
    const email2 = faker.internet.email();

    // First user
    cy.log(`Teste nome duplicado: ${name}`);
    cy.request('POST', '/users', { name, email: email1 }).then((response1) => {
      expect(response1.status).to.eq(201);

      // Attempt to create another user with the same name, but different email
      cy.request({
        method: 'POST',
        url: '/users',
        failOnStatusCode: false,
        body: { name, email: email2 }
      }).then((response2) => {
        expect(response2.status).to.eq(409);
        expect(response2.body).to.have.property('error', 'A user with this name or email already exists.');
      });
    });
  });


  it('Deve retornar erro ao tentar atualizar um usuário inexistente', () => {
    const fakeUserId = 999999;

    cy.request({
      method: 'PUT',
      url: `/users/${fakeUserId}`,
      failOnStatusCode: false,
      body: {
        name: faker.person.fullName()
      }
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'User not found.');
    });
  });

})