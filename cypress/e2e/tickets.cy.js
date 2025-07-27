import { generateFakeUser, createUser, generateFakeTicket, createTicket } from '../support/utils';
import { faker } from '@faker-js/faker';

describe('Tickets - Criados com Sucesso', () => {

  let ticketId;
  let userId;
  const statusOptions = ['On Hold', 'In Progress', 'Closed'];

  before(() => {
    const user = generateFakeUser();
    createUser({ data: user }).then((response) => {
      userId = response.body.id;
      cy.log(`Usuario criado com ID: ${userId}`);
    });
  });

  it('Deve criar ticket com sucesso', () => {
    const ticket = generateFakeTicket({ userId });

    createTicket({ data: ticket }).then((response) => {
      cy.log(`Ticket criado com ID: ${response.body.id}`);
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
      expect(response.body).to.include({
        userId: ticket.userId,
        description: ticket.description,
        status: 'Open'
      });
      ticketId = response.body.id;
    });
  });

  it('Deve recuperar um bilhete por ID', () => {
    cy.log(`Fetching ticket with ID: ${ticketId}`);
    cy.request("GET", `/tickets/${ticketId}`).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('id', ticketId);
      expect(response.body).to.have.all.keys('id', 'userId', 'description', 'status', 'createdAt');
    });
  });

  it('Deve atualizar o status do tíquete', () => {
    const chosenStatus = faker.helpers.arrayElement(statusOptions);
    cy.log(`Updating ticket status to: ${chosenStatus}`);

    cy.request("PUT", `/tickets/${ticketId}/status`, {
      status: chosenStatus
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.ticket).to.have.property('status', chosenStatus);
    });
  });

  it('Deve deletar ticket criado', () => {
    cy.request("DELETE", `/tickets/${ticketId}`).then((response) => {
      cy.log(`Ticket with id: ${ticketId} deleted`);
      expect(response.status).to.be.oneOf([200, 204]);
      expect(response.body).to.have.property('message', 'Ticket deleted successfully.')
    });
  });

  it('Não deve encontrar o bilhete eliminado', () => {
    cy.log(`Tentando obter o ID do tíquete excluído: ${ticketId}`);
    cy.request({
      method: "GET",
      url: `/tickets/${ticketId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Ticket not found.');
    });
  });

});

describe('Tickets - Tratamento de Erros', () => {

  const fakeTicketId = 999999;

  it('Não deve permitir a criação de tickets sem userId', () => {
    const ticket = generateFakeTicket();
    delete ticket.userId;

    cy.log('Criando ticket sem userId');

    createTicket({ data: ticket, acceptError: true }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('error', 'The fields userId and description are required.');
    });
  });

  it('Não deve permitir a criação de tickets com userId inexistente', () => {
    const fakeUserId = 999999;

    cy.request({
      method: 'POST',
      url: '/tickets',
      failOnStatusCode: false,
      body: {
        userId: fakeUserId,
        description: faker.lorem.sentence()
      }
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error');
      expect(response.body.error.toLowerCase()).to.include('user');
    });
  });

  it('Deve retornar erro ao tentar atualizar um status de tíquete inexistente', () => {
    cy.request({
      method: 'PUT',
      url: `/tickets/${fakeTicketId}/status`,
      failOnStatusCode: false,
      body: {
        status: 'Closed'
      }
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('error', 'Ticket not found.');
    });
  });


})