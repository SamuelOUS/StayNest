Feature: Flujo de creación de propiedad

  Background:
    Given que estoy logueado con usuario "PedroUser884" y contraseña "Abcdef1234!"

  Scenario: Crear una propiedad válida
    When navego a la página de creación de propiedad
    And subo las imágenes:
      | house1.webp |
      | house2.webp |
      | house3.webp |
      | house4.webp |
    And completo el formulario con:
      | title       | Casa de Prueba                      |
      | address     | Calle 123, Ciudad Prueba            |
      | bedrooms    | 3                                  |
      | capacity    | 6                                  |
      | bathrooms   | 2                                  |
      | description | Una hermosa casa de prueba con piscina y jardín. |
      | price       | 250000                             |
    And envío el formulario
    Then la propiedad se crea exitosamente

  Scenario: Mostrar error si no hay suficientes imágenes
    When navego a la página de creación de propiedad
    And subo las imágenes:
      | house1.webp |
      | house2.webp |
    And intento enviar el formulario
    Then debo ver el error "Agrega al menos 4 fotos"

  Scenario: Cancelar creación y volver al home
    When navego a la página de creación de propiedad
    And cancelo la creación
    Then debo ser redirigido a "/home"
