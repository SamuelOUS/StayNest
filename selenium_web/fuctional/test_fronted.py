import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

BASE_URL = "http://localhost:4200/home"


def test_pagina_principal_elemento_presente():
    """
    PPrueba funcional para verificar la presencia de un elemento house-item en la página principal..
    """
    driver = webdriver.Chrome()
    try:
        driver.get(BASE_URL)
        wait = WebDriverWait(driver, 10)
        main_element = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "house-item")))
        assert main_element.is_displayed()
        print("Prueba 1 completada: Elemento house-item presente en la página de inicio éxitosamente.")
    except TimeoutException:
        print("Prueba 1 falló: El elemento house-item no se encontró o no fue visible a tiempo en la página de inicio.")
        raise
    finally:
        driver.quit()

def test_navegacion_a_pagina_listar_detalles():
    """
    Prueba funcional para verificar la visualización de los detalles de un alojamiento.
    """
    driver = webdriver.Chrome()
    try:
        driver.get(BASE_URL)
        wait = WebDriverWait(driver, 10)

        listar_click = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "house-item")))
        listar_click.click()

        detalles = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "house-detailing")))
        assert detalles.is_displayed()
        print("Prueba 2 completada: Navegación a la página de detalles de un alojamiento exitoso.")
    except TimeoutException:
        print("Prueba 2 falló: No se pudo hacer clic para visitar los detalles de una propiedad o la página no cargó a tiempo.")
        raise
    finally:
        driver.quit()

def test_info_propietario():
    """
    Prueba funcional para verificar la navegación a la página de detalles de una propiedad y ver info del propietario.
    """
    driver = webdriver.Chrome()
    try:
        driver.get(BASE_URL)
        wait = WebDriverWait(driver, 10)

        listar_click = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "house-item")))
        listar_click.click()

        propietario = wait.until(EC.visibility_of_element_located((By.CLASS_NAME, "user-datiling")))
        assert propietario.is_displayed()
        print("Prueba 3 completada: Navegación a la página de detalles de una propiedad y ver info del propietario exitosa.")
    except TimeoutException:
        print("Prueba 3 falló: No se pudo navegar a la página de detalles de una propiedad y ver info del propietario o la página no cargó a tiempo.")
        raise
    finally:
        driver.quit()

def test_registro_usuario():
    """
    Prueba funcional para llenar el formulario de registro y verificar el registro.
    """
    driver = webdriver.Chrome()
    try:
        driver.get(BASE_URL)  

        wait = WebDriverWait(driver, 20)

        menu_icon = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "img[src='/menu.png']")))
        menu_icon.click()

        registrar_link = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[.//span[text()='Registrarse']]")))
        registrar_link.click()

        nombre_input = wait.until(
            EC.visibility_of_element_located((By.XPATH, "//input[@formControlName='name']"))
        )
        nombre_input.send_keys("Usuario de Prueba")

        usuario_input = wait.until(
            EC.visibility_of_element_located((By.XPATH, "//input[@formControlName='username']"))
        )
        usuario_input.send_keys("Usuario1prueba")

        email_input = wait.until(
            EC.visibility_of_element_located((By.XPATH, "//input[@formControlName='email']"))
        )
        email_input.send_keys("prueba@gmail.com")

        password_input = wait.until(
            EC.visibility_of_element_located((By.XPATH, "//input[@formControlName='password']"))
        )
        password_input.send_keys("P@sswOrd123")

        repassword_input = wait.until(
            EC.visibility_of_element_located((By.XPATH, "//input[@formControlName='rePassword']"))
        )
        repassword_input.send_keys("P@sswOrd123")

        # Verificar y seleccionar el checkbox "isOwner"
        #checkbox = wait.until(EC.element_to_be_clickable((By.ID, "mat-mdc-checkbox-7-input")))
        #checkbox.click()  # Para marcar o desmarcar el checkbox

        registrar_button = wait.until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Registrarse')]"))
        )
        registrar_button.click()

        print("Prueba 4 completada: Registro de usuario exitoso.")

    except TimeoutException:
        print(
            "Prueba 4 falló: No se encontraron los elementos del formulario o la operación tardó demasiado."
        )
        raise
    except Exception as e:
        print(f"Ocurrió un error durante la prueba: {e}")
        raise
    finally:
        driver.quit()



if __name__ == "__main__":
    test_pagina_principal_elemento_presente()
    test_navegacion_a_pagina_listar_detalles()
    test_info_propietario()
    test_registro_usuario()

   