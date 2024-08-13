document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const contextMenu = document.querySelector('.context-menu');
    const btnRegister = document.getElementById('btnRegister'); // Selector corregido
    const btnLogin = document.getElementById('btnLogin'); // Selector corregido
    const modalRegister = document.getElementById("modalRegister");
    const modalLogin = document.getElementById("modalLogin");
    const spanCloseRegister = document.querySelector('#modalRegister .close'); // Selector corregido
    const spanCloseLogin = document.querySelector('#modalLogin .close'); // Selector corregido

    // Escuchar el clic en el botón del menú
    menuBtn.addEventListener('click', () => {
        contextMenu.classList.toggle('active');
    });

    // Escuchar clics fuera del menú para cerrarlo
    document.addEventListener('click', (event) => {
        if (!menuBtn.contains(event.target) && !contextMenu.contains(event.target)) {
            contextMenu.classList.remove('active');
        }
    });

    // Abre el modal al hacer clic en "Registrarse"
    btnRegister.addEventListener('click', (event) => {
        event.preventDefault(); // Previene la acción predeterminada del enlace
        modalRegister.style.display = "block";
    });

    // Cierra el modal de registro al hacer clic en la 'X'
    spanCloseRegister.addEventListener('click', () => {
        modalRegister.style.display = "none";
    });

    // Cierra el modal de registro si el usuario hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target == modalRegister) {
            modalRegister.style.display = "none";
        }
    });

    // Abre el modal al hacer clic en "Iniciar Sesión"
    btnLogin.addEventListener('click', (event) => {
        event.preventDefault(); // Previene la acción predeterminada del enlace
        modalLogin.style.display = "block";
    });

    // Cierra el modal de inicio de sesión al hacer clic en la 'X'
    spanCloseLogin.addEventListener('click', () => {
        modalLogin.style.display = "none";
    });

    // Cierra el modal de inicio de sesión si el usuario hace clic fuera del contenido del modal
    window.addEventListener('click', (event) => {
        if (event.target == modalLogin) {
            modalLogin.style.display = "none";
        }
    });
});
