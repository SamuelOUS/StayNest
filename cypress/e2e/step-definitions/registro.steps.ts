import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

let randomNumber = 0;

Given('que estoy en la página de inicio', () => {
  cy.visit('/home');
});

Given('abro el modal de registro', () => {
  cy.get('.menu-btn').click();
  cy.contains('Registrarse').click();
});

When('hago clic en el botón {string}', (buttonText: string) => {
  cy.get('button').contains(buttonText).click();
});

When('ingreso el nombre {string}', (name: string) => {
  cy.get('[formControlName="name"]').clear().type(name);
});

When('ingreso el nombre de usuario {string}', (username: string) => {
  cy.get('[formControlName="username"]').clear().type(username);
});

When('pierdo foco del campo nombre de usuario', () => {
  cy.get('[formControlName="username"]').blur();
});

When('ingreso el correo {string}', (email: string) => {
  cy.get('[formControlName="email"]').clear().type(email);
});

When('ingreso la contraseña {string}', (password: string) => {
  cy.get('[formControlName="password"]').clear().type(password);
});

Then('la barra de progreso debe tener valor {string}', (value: string) => {
  cy.get('mat-progress-bar').should('have.attr', 'aria-valuenow', value);
});

Then('debo ver la fortaleza {string}', (strength: string) => {
  cy.contains(strength);
});

When('ingreso la confirmación de contraseña {string}', (rePassword: string) => {
  cy.get('[formControlName="rePassword"]').clear().type(rePassword);
});

When('intercepciono la petición POST a {string} como {string}', (url: string, alias: string) => {
  cy.intercept('POST', `http://localhost:3000${url}`).as(alias);
  randomNumber = Math.floor(Math.random() * 1000);
});

When('ingreso un nombre de usuario aleatorio con prefijo {string}', (prefix: string) => {
  cy.get('[formControlName="username"]').clear().type(`${prefix}${randomNumber}`);
});

When('ingreso un correo aleatorio con prefijo {string}', (prefix: string) => {
  cy.get('[formControlName="email"]').clear().type(`${prefix}${randomNumber}@email.com`);
});

Then('la petición {string} debe responder con código {int}', (alias: string, statusCode: number) => {
  cy.wait(`@${alias}`).then((interception) => {
    expect(interception.response?.statusCode).to.eq(statusCode);
  });
});

When('hago clic en el enlace {string}', (linkText: string) => {
  cy.contains(linkText).click();
});

Then('debo ver el título {string}', (titleText: string) => {
  cy.get('h2').should('contain', titleText);
});

Then('debo ver el mensaje de error {string}', (msg) => {
  cy.get('.error-message').should('contain', msg);
});
