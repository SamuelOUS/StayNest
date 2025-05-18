Feature: Registro de usuario - StayNest

  Background:
    Given que estoy en la página de inicio
    And abro el modal de registro

  Scenario: Mostrar error si los campos están vacíos
    When hago clic en el botón "Registrarse"
    Then debo ver el error "Mal registro :("

  Scenario: Validar nombre de usuario incorrecto
    When ingreso el nombre "User Test"
    And ingreso el nombre de usuario "user12"
    And pierdo foco del campo nombre de usuario
    Then debo ver el mensaje de error "El nombre de usuario debe tener al menos 8 caracteres"

  Scenario: Mostrar contraseña débil
    When ingreso el nombre "Pedro Pérez"
    And ingreso el nombre de usuario "PedroUser1"
    And ingreso el correo "pedro@email.com"
    And ingreso la contraseña "abc123"
    Then la barra de progreso debe tener valor "33"
    And debo ver la fortaleza "Baja"

  Scenario: Mostrar error si las contraseñas no coinciden
    When ingreso el nombre "Pedro Pérez"
    And ingreso el nombre de usuario "PedroUser1"
    And ingreso el correo "pedro@email.com"
    And ingreso la contraseña "Abcdefg1234!"
    And ingreso la confirmación de contraseña "Otra12345678!"
    And hago clic en el botón "Registrarse"
    Then debo ver el error "Las contraseñas no coinciden"

  Scenario: Registrar un usuario válido
    When intercepciono la petición POST a "/api/users" como "registerRequest"
    And ingreso el nombre "Pedro Pérez"
    And ingreso un nombre de usuario aleatorio con prefijo "PedroUser"
    And ingreso un correo aleatorio con prefijo "pedro"
    And ingreso la contraseña "Abcdef1234!"
    And ingreso la confirmación de contraseña "Abcdef1234!"
    And hago clic en el botón "Registrarse"
    Then la petición "registerRequest" debe responder con código 201

  Scenario: Abrir modal de iniciar sesión
    When hago clic en el enlace "¿Ya tienes una cuenta?"
    Then debo ver el título "Iniciar Sesión"
