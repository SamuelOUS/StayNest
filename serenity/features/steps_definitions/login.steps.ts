import { actorInTheSpotlight } from '@serenity-js/core';
import {
  Navigate,
  PageElement,
  Enter,
  Click,
  Text,
  By,
  isVisible,
} from '@serenity-js/web';
import { Given, When, Then } from '@cucumber/cucumber';
import { Ensure, includes } from '@serenity-js/assertions';

const UsernameField = PageElement.located(
  By.css('[formControlName="username"]')
).describedAs('campo de usuario');

const PasswordField = PageElement.located(
  By.css('[formControlName="password"]')
).describedAs('campo de contraseña');

const LoginButton = PageElement.located(
  By.css('button:has-text("Iniciar sesión")')
).describedAs('botón de iniciar sesión');

const SwalText = PageElement.located(By.css('.swal2-popup'));

const MenuButton = PageElement.located(By.css('a.menu-btn')).describedAs(
  'botón del menú'
);

Given('que el usuario abre la aplicación', async function () {
  await actorInTheSpotlight().attemptsTo(Navigate.to('http://localhost:4200'));
});

When('abre el menú y selecciona iniciar sesión', async function () {
  await actorInTheSpotlight().attemptsTo(
    Ensure.that(MenuButton, isVisible()),
    Click.on(MenuButton),
    Ensure.that(
      PageElement.located(By.cssContainingText('a', 'Iniciar Sesión')),
      isVisible()
    ),
    Click.on(PageElement.located(By.cssContainingText('a', 'Iniciar Sesión')))
  );
});

When(
  'introduce su nombre de usuario y contraseña correctamente',
  async function () {
    await actorInTheSpotlight().attemptsTo(
      Ensure.that(UsernameField, isVisible()),
      Enter.theValue('PedroUser884').into(UsernameField),
      Ensure.that(PasswordField, isVisible()),
      Enter.theValue('Abcdef1234!').into(PasswordField),
      Ensure.that(LoginButton, isVisible()),
      Click.on(LoginButton)
    );
  }
);

Then('debería ver un mensaje de inicio exitoso', async function () {
  await actorInTheSpotlight().attemptsTo(
    Ensure.that(Text.of(SwalText), includes('Inicio exitoso'))
  );
});
