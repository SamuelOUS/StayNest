describe('Flujo de creación de propiedad', () => {

    beforeEach(() => {
        // Visitar página principal
        cy.visit('/home');
        cy.get('.menu-btn').click();
        cy.contains('Iniciar Sesión').click();

        // Hacer login primero
        cy.get('input[formControlName="username"]').type('PedroUser884');
        cy.get('input[formControlName="password"]').type('Abcdef1234!');
        cy.get('button').contains('Iniciar sesión').click();

        // cy.get('.menu-btn').click().should('contain', 'Añadir Propiedad');

        // Asegurarse que se redirige o cambia el estado de sesión
        cy.wait(2000); // Puedes ajustar si tu app tiene redireccionamiento
    });

    it('Debe permitir crear una propiedad válida', () => {
        // Aquí ya deberías estar en la vista principal después del login

        // Navegar a la sección de crear propiedad
        cy.visit('/create-property'); // Ajusta esta ruta si es diferente

        // Subir 4 imágenes simuladas
        const uploadImage = (fileName: string) => {
            cy.get('input[type="file"]').selectFile(`./cypress/fixtures/${fileName}`, { force: true });
            cy.wait(2000);
        };

        cy.intercept('POST', 'http://localhost:3000/api/properties').as('createPropertyRequest');

        uploadImage('house1.webp');
        uploadImage('house2.webp');
        uploadImage('house3.webp');
        uploadImage('house4.webp');

        // Completar el formulario
        cy.get('input[formControlName="title"]').type('Casa de Prueba');
        cy.get('input[formControlName="address"]').type('Calle 123, Ciudad Prueba');
        cy.get('input[formControlName="bedrooms"]').type('3');
        cy.get('input[formControlName="capacity"]').type('6');
        cy.get('input[formControlName="bathrooms"]').type('2');
        cy.get('textarea[formControlName="description"]').type('Una hermosa casa de prueba con piscina y jardín.');
        cy.get('input[formControlName="price"]').type('250000');

        // Enviar el formulario
        cy.get('button.btn-aceptar').click();

        cy.wait('@createPropertyRequest').then((interception) => {
            expect(interception.response?.statusCode).to.eq(201);
        });
    });

    it('Debe mostrar error si no hay suficientes imágenes', () => {
        cy.visit('http://localhost:4200/create-property');

        const uploadImage = (fileName: string) => {
            cy.get('input[type="file"]').selectFile(`./cypress/fixtures/${fileName}`, { force: true });
            cy.wait(2000);
        };

        uploadImage('house1.webp');
        uploadImage('house2.webp');

        cy.get('button.btn-aceptar').click();
        cy.get('.swal2-popup', { timeout: 1000 }) 
            .should('be.visible')
        cy.get('.swal2-html-container')
            .should('contain', 'Agrega al menos 4 fotos');

    });

    it('Debe cancelar la creación y volver al home', () => {
        cy.visit('http://localhost:4200/create-property');

        cy.get('button.btn-cancelar').click();

        // Verificar que redirige (ajusta si tu home tiene un identificador)
        cy.url().should('include', '/home');
    });

});
