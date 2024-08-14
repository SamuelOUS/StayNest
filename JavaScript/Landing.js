document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.menu-btn');
    const contextMenu = document.querySelector('.context-menu');
    const btnRegister = document.getElementById('btnRegister');
    const btnLogin = document.getElementById('btnLogin');
    const modalRegister = document.getElementById("modalRegister");
    const modalLogin = document.getElementById("modalLogin");
    const spanCloseRegister = document.querySelector('#modalRegister .close'); 
    const spanCloseLogin = document.querySelector('#modalLogin .close'); 
    const logo = document.getElementById('logo');

 

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
        modalRegister.style.display = "block";
    });

    
    spanCloseRegister.addEventListener('click', () => {
        modalRegister.style.display = "none";
    });

   
    window.addEventListener('click', (event) => {
        if (event.target == modalRegister) {
            modalRegister.style.display = "none";
        }
    });

   
    btnLogin.addEventListener('click', (event) => {
        event.preventDefault(); 
        modalLogin.style.display = "block";
    });

    
    spanCloseLogin.addEventListener('click', () => {
        modalLogin.style.display = "none";
    });

    
    window.addEventListener('click', (event) => {
        if (event.target == modalLogin) {
            modalLogin.style.display = "none";
        }
    });
});
