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
    const loginError = document.getElementById('loginError'); // Elemento para mostrar errores en el login

    const toggleModalVisibility = (modal, show) => {
        modal.style.display = show ? "block" : "none";
    };

    togglePassword.addEventListener('click', () => {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        togglePassword.querySelector('i').classList.toggle('fa-eye');
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    function validarUserName(username) {
        const regex = /^[a-zA-Z][a-zA-Z0-9]{7,14}$/;
        const usernameElement = document.getElementById('usernameError');

        if (!regex.test(username)){
            usernameElement.textContent = "Nombre de usuario inválido"
            return false
        }
        return true;
    }

    function validarPassword(password) {
        const errorElement = document.getElementById('passwordError');
        const rePassword = document.getElementById('re-register-password').value.trim();
        const regexMayuscula = /[A-Z]/;
        const regexNumero = /[0-9]/;
        const regexEspecial = /[!@#$%^&*]/;
        const mensajes = [];

        if (password.length < 8 || password.length > 15) {
            mensajes.push("La contraseña debe tener entre 8 y 15 caracteres.");
        }
        if (!regexMayuscula.test(password)) {
            mensajes.push("La contraseña debe contener al menos una letra mayúscula.");
        }
        if (!regexNumero.test(password)) {
            mensajes.push("La contraseña debe contener al menos un número.");
        }
        if (!regexEspecial.test(password)) {
            mensajes.push("La contraseña debe contener al menos un carácter especial.");
        }
        if (password !== rePassword){
            mensajes.push("Las contraseñas no coinciden.");
        }
    
        errorElement.textContent = mensajes.join(' ');
        return mensajes.length === 0;
    }

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();

        // Validar nombre de usuario
        if (!validarUserName(username)) {
            return;
        }

        // Validar la contraseña
        if (!validarPassword(password)) {
            return;
        }

        // Guardar usuario si todo es válido
        localStorage.setItem('registeredUser', JSON.stringify({ username, email, password }));
        alert('Usuario registrado con éxito');
        toggleModalVisibility(modalRegister, false);
    });

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const enteredUser = document.getElementById('loginUser').value.trim();
        const enteredPassword = document.getElementById('loginPassword').value.trim();

        // Obtener los datos del usuario registrado desde el localStorage
        const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

        // Limpiar mensajes de error
        loginError.textContent = '';

        // Validar credenciales
        if (storedUser) {
            const { username, password } = storedUser;
            if (enteredUser === username && enteredPassword === password) {
                console.log(username, enteredUser, password);
                alert('Inicio de sesión exitoso');
                toggleModalVisibility(modalLogin, false);
            } else {
                loginError.textContent = 'Nombre de usuario o contraseña incorrectos';
            }
        } else {
            loginError.textContent = 'No hay usuarios registrados';
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
