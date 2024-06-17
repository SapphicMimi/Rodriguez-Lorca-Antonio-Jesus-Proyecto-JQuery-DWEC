/* Creo el botón para volver al Inicio. */
$("#back").on("click", () => {
    $(location).attr("href","../index.html");
})

/* Hago que el boton de irse a registrarse, cambie al formulario de registro y limpio los elementos p del formulario del login. */
$("#changeRegister").on("click", () => {
    $("#errorLogin").text(" ");

    $("#login").addClass("hidden").removeClass("login");

    $("#register").addClass("register").removeClass("hidden");
})

/* Hago que el boton de iniciar sesión, cambie al formulario para iniciar sesión, y limpio los elementos p del formulario del registro. */
$("#changeLogin").on("click", () => {
    $("#errorRegister").text(" ");
    $("#complete").text(" ");

    $("#register").addClass("hidden").removeClass("register");

    $("#login").addClass("login").removeClass("hidden");
})

/* Le doy al boton de Inicio de Sesión, la función que permite Inciar Sesión */
$("#loginButton").on("click", (event) => {
    event.preventDefault();
    login();
})

/* Le doy al boton de Registro, la función que permite registrarse */
$("#registerButton").on("click", (event) => {
    event.preventDefault();
    register();
})

/* Funcion que permite Iniciar sesión */
// Compruebo si existe un objeto en el almacenamiento local con el mismo nombre que el usuario que se va a registrar, y si existe, compruebo si la 
// contraseña es la misma. Si va todo bien, crearé la sesión con los datos del objeto del usuario, por si tiene likes, favoritos o dislikes.
// Una vez creada la sesión, mando al inicio.
function login() {
    let userL = $("#userLogin").val();
    let passL = $("#userPass").val();

    let userLC = JSON.parse(localStorage.getItem(userL));

    if(userLC != null && userLC.pass == passL) {
        let sesion = {
            user: userLC.user,
            fav: userLC.fav,
            like: userLC.like,
            dislike: userLC.dislike
        }

        localStorage.setItem("sesion", JSON.stringify(sesion));

        window.location.href = "../index.html";
    } else {
        $("#errorLogin").text("Usuario, o contraseña equivocada.");
    }
}

/* Función que me permite Registrarme */
// Primero compruebo si existe un objeto con el nombre del usuario a registrarse, y si no existe, compruebo si la contraseña no esta vacía.
// Tanto en login como aqui, mando mensajes de error, por si algo sale mal, ya sea que existe el usuario o la contraseña esta vacía.
// Una vez se haya comprobado todom se crea un objeto nuevo con los datos del usuario, y nuevos arrays donde van a ir los fav, likes y más.
function register() {
    let userR = $("#user").val();
    let passR = $("#pass").val();

    if(JSON.parse(localStorage.getItem(userR)) || !passR) {
        $("#complete").text(" ");
        $("#errorRegister").text("El usuario elegido ya existe en el sistema, o has dejado la contraseña en blanco.");
    } else {
        let newUser = {
            user: userR,
            pass: passR,
            fav: [],
            like: [],
            dislike: []
        }

        localStorage.setItem(userR, JSON.stringify(newUser));
        $("#errorRegister").text(" ");
        $("#complete").text("¡Usuario "+ userR + " creado con éxito!");
    }
}