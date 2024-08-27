document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const contextMenu = document.querySelector('.context-menu');
    const btnRegister = document.getElementById('btnRegister');
    const btnLogin = document.getElementById('btnLogin');
    const modalRegister = document.getElementById("modalRegister");
    const modalLogin = document.getElementById("modalLogin");
    const spanCloseRegister = modalRegister.querySelector('.close');
    const spanCloseLogin = modalLogin.querySelector('.close');
    const registerForm = modalRegister.querySelector('form');
    const loginForm = modalLogin.querySelector('form');
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('loginPassword');

    // Función para manejar la visibilidad de los modales
    const toggleModalVisibility = (modal, show) => {
        modal.style.display = show ? "block" : "none";
    };

    // Función para alternar la visibilidad de la contraseña en LogIn
    togglePassword.addEventListener('click', () => {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        togglePassword.querySelector('i').classList.toggle('fa-eye');
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Función Validaciones username Registro
    function validarUserName(username) {
        const regex = /^[a-zA-Z][a-zA-Z0-9]{7,14}$/;
    
        if (regex.test(username)) {
            return true;
        } else {
            return false;
        }
    }
    
    
    
    // Almacenar usuario registrado en el localStorage del navegador
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const rePassword = document.getElementById('re-register-password').value.trim();
        
        // Validar username  
        if (!validarUserName(username)) 
        {
            alert("El nombre de usuario no es válido.");
            return
        }
        
        // Validar email
        
        // Validar que las dos contraseñas ingresadas concuerden
        if (password===rePassword) {
            // Guardar usuario y contraseña en el localStorage
            localStorage.setItem('registeredUser', JSON.stringify({
                username,
                email,
                password
            }));
            alert('Usuario registrado con éxito');
            toggleModalVisibility(modalRegister, false);     
        } else {
            alert('Las contraseñas ingresadas no coinciden')
        }
    });






    // Validar usuario al iniciar sesión
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const enteredEmail = document.getElementById('loginEmail').value.trim();
        const enteredPassword = document.getElementById('loginPassword').value.trim();

        // Obtener los datos del usuario registrado desde el localStorage
        const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

        // Validar credenciales
        if (storedUser) {
            const { email, password } = storedUser;
            if (enteredEmail === email && enteredPassword === password) {
                alert('Inicio de sesión exitoso');
                toggleModalVisibility(modalLogin, false);
            } else {
                alert('Correo electrónico o contraseña incorrectos');
            }
        } else {
            alert('No hay usuarios registrados');
        }
    });

    // Manejar la apertura y cierre de menús y modales
    menuBtn.addEventListener('click', () => {
        contextMenu.classList.toggle('active');
    });

    document.addEventListener('click', (event) => {
        if (!menuBtn.contains(event.target) && !contextMenu.contains(event.target)) {
            contextMenu.classList.remove('active');
        }
    });

    btnRegister.addEventListener('click', (event) => {
        event.preventDefault();
        toggleModalVisibility(modalRegister, true);
    });

    spanCloseRegister.addEventListener('click', () => {
        toggleModalVisibility(modalRegister, false);
    });

    btnLogin.addEventListener('click', (event) => {
        event.preventDefault();
        toggleModalVisibility(modalLogin, true);
    });

    spanCloseLogin.addEventListener('click', () => {
        toggleModalVisibility(modalLogin, false);
    });

    // Prevenir que el modal de inicio de sesión se cierre al hacer clic fuera de él
    modalLogin.querySelector('.modal-content').addEventListener('click', (event) => {
        event.stopPropagation();
    });
});