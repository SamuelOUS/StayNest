// Nombre de usuario, correo electrónico, contraseña y opciones
// adicionales como perfil de propietario
export interface User{
    photo?: string,
    username:string,
    password:string,
    email?:string,
    owner?:boolean
}