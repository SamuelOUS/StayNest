Feature: Inicio de sesión

  Scenario: Usuario inicia sesión correctamente
  Given que el usuario abre la aplicación
  When abre el menú y selecciona iniciar sesión
  And introduce su nombre de usuario y contraseña correctamente
  Then debería ver un mensaje de inicio exitoso

