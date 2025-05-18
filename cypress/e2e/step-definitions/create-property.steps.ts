import {
  Given,
  When,
  Then,
  DataTable,
} from '@badeball/cypress-cucumber-preprocessor';

Given(
  'que estoy logueado con usuario {string} y contraseña {string}',
  (username: string, password: string) => {
    cy.visit('/home');
    cy.get('.menu-btn').click();
    cy.contains('Iniciar Sesión').click();

    cy.get('input[formControlName="username"]').type(username);
    cy.get('input[formControlName="password"]').type(password);
    cy.get('button').contains('Iniciar sesión').click();

    cy.wait(2000);
  }
);

When('navego a la página de creación de propiedad', () => {
  cy.visit('/create-property');
});

When('subo las imágenes:', (dataTable: DataTable) => {
  const uploadImage = (fileName: string) => {
    cy.get('input[type="file"]').selectFile(`./cypress/fixtures/${fileName}`, {
      force: true,
    });
    cy.wait(3000);
  };

  dataTable.raw().forEach(([fileName]) => {
    uploadImage(fileName);
  });
});

When('completo el formulario con:', (dataTable: DataTable) => {
  const data = dataTable.rowsHash();
  cy.get('input[formControlName="title"]').type(data['title']);
  cy.get('input[formControlName="address"]').type(data['address']);
  cy.get('input[formControlName="bedrooms"]').type(data['bedrooms']);
  cy.get('input[formControlName="capacity"]').type(data['capacity']);
  cy.get('input[formControlName="bathrooms"]').type(data['bathrooms']);
  cy.get('textarea[formControlName="description"]').type(data['description']);
  cy.get('input[formControlName="price"]').type(data['price']);
});

When('envío el formulario', () => {
  cy.intercept('POST', 'http://localhost:3000/api/properties').as(
    'createPropertyRequest'
  );
  cy.get('button.btn-aceptar').click();
  cy.wait('@createPropertyRequest')
    .its('response.statusCode')
    .should('eq', 201);
});

When('intento enviar el formulario', () => {
  cy.get('button.btn-aceptar').click();
});

When('cancelo la creación', () => {
  cy.get('button.btn-cancelar').click();
});

Then('la propiedad se crea exitosamente', () => {
  // Ya validado en el wait del envío, aquí puedes agregar más validaciones si quieres
  cy.get('.swal2-html-container')
    .should('contain', 'Propiedad guardada')
    .should('be.visible');
});

Then('debo ver el error {string}', (errorMessage) => {
  cy.wait(1000);
  cy.get('.swal2-popup', { timeout: 1000 }).should('be.visible');
  cy.get('.swal2-popup').should('contain', errorMessage);
});

Then('debo ser redirigido a {string}', (url) => {
  cy.url().should('include', url);
});
