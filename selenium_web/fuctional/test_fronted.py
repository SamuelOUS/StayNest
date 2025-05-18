import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_pagina_principal_elemento_presente():
    """
    Prueba funcional para verificar la presencia de un elemento en la página principal.
    """
    # Inicializar el WebDriver (Selenium Manager intentará gestionarlo)
    driver = webdriver.Chrome()

    try:
        # 1. Navegar a la página principal del frontend
        driver.get("http://localhost:4200/home")  # Reemplaza con la URL real si es diferente

        # 2. Esperar a que un elemento específico esté presente en la página
        # Aquí, asumimos que hay un elemento con un class_name "house-item" que representa el elemento principal
        wait = WebDriverWait(driver, 10)
        class_name = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "house-item")))

        # 3. Verificar que el elemento es visible
        assert class_name.is_displayed()

        print("Prueba funcional completada exitosamente: El elemento principal está presente en la página.")

    except Exception as e:
        print(f"La prueba funcional falló: {e}")
        raise

    finally:
        # Cerrar el navegador al finalizar la prueba
        if 'driver' in locals():
            driver.quit()

if __name__ == "__main__":
    test_pagina_principal_elemento_presente()