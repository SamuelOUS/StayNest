
//* Pruebas E2E
describe('Registro de usuario - StayNest', () => {

  const openRegisterModal = () => {
    cy.visit('/home'); 
    cy.get('.menu-btn').click();
    cy.contains('Registrarse').click(); // Abre el modal
  };

  beforeEach(() => {
    openRegisterModal();
  });

  it('Debe mostrar error si los campos están vacíos', () => {
    cy.get('button').contains('Registrarse').click();
    cy.get('.swal2-title').should('contain', 'Mal registro :(');
  });

  it('Debe validar el nombre de usuario incorrecto', () => {
    cy.get('[formControlName="name"]').type('User Test');
    cy.get('[formControlName="username"]').type('user12');
    cy.get('[formControlName="username"]').blur();
    cy.get('.error-message')
      .should('contain', 'El nombre de usuario debe tener al menos 8 caracteres');
  });

  it('Debe mostrar que la contraseña es débil', () => {
    cy.get('[formControlName="name"]').type('Pedro Pérez');
    cy.get('[formControlName="username"]').type('PedroUser1');
    cy.get('[formControlName="email"]').type('pedro@email.com');
    cy.get('[formControlName="password"]').type('abc123');
    cy.get('mat-progress-bar').should('have.attr', 'aria-valuenow', '33');
    cy.contains('Baja');
  });

  it('Debe mostrar error si las contraseñas no coinciden', () => {
    cy.get('[formControlName="name"]').type('Pedro Pérez');
    cy.get('[formControlName="username"]').type('PedroUser1');
    cy.get('[formControlName="email"]').type('pedro@email.com');
    cy.get('[formControlName="password"]').type('Abcdefg1234!');
    cy.get('[formControlName="rePassword"]').type('Otra12345678!');
    cy.get('button').contains('Registrarse').click();
    cy.get('.swal2-title').should('contain', 'Las contraseñas no coinciden');
  });

  it('Debe permitir registrar un usuario válido', () => {

    cy.intercept('POST', 'http://localhost:3000/api/users').as('registerRequest');
    const number = Math.floor(Math.random() * 1000);
    
    cy.get('[formControlName="name"]').type('Pedro Pérez');
    cy.get('[formControlName="username"]').type('PedroUser' + number);
    cy.get('[formControlName="email"]').type(`pedro${number}@email.com`);
    cy.get('[formControlName="password"]').type('Abcdef1234!');
    cy.get('[formControlName="rePassword"]').type('Abcdef1234!');

    cy.get('button').contains('Registrarse').click();

    cy.wait('@registerRequest').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
    });

  });

  it('Debe abrir el modal de iniciar sesión si el usuario hace clic en "¿Ya tienes una cuenta?"', () => {
    cy.contains('¿Ya tienes una cuenta?').click();
    cy.get('h2').should('contain', 'Iniciar Sesión');
  });

});
