## Helpdesk-API-Test
Desafio de Automação de Testes - Helpdesk API

## Tecnologias usadas

- [Cypress](https://www.cypress.io/)
- [Faker.js](https://www.npmjs.com/package/@faker-js/faker)
- [MochaAwesome](https://www.npmjs.com/package/mochawesome)

## Pre requisitos

- Node.js
- Helpdesk API running locally at `http://localhost:3000`

## Como rodar os testes

1. Clone o repositório da API Helpdesk

- git clone https://github.com/automacaohml/helpdesk-api.git
- cd helpdesk-api

2. Instalar as dependencias 

- npm install

3. Inicie a API server

- node server.js

4. Clona o repositorio de teste

- git clone https://github.com/tamyrds/helpDeskapi-Teste
- cd helpdesk-api-tests
- npm install

5. Rodar os testes

- npx cypress open
