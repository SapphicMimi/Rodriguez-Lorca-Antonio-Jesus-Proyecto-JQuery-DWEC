/* Variable donde voy a almacenar la Sesión */
let sesion;

/* Lo primero que hago es comprobar la sesión */
$(() => {
    checkSesion();
})

/* Funcion que comprueba la sesión, y dependiendo de si esta inicia la sesión o no, muestro unos botones u otros en el header */
function checkSesion() {
    sesion = JSON.parse(localStorage.getItem("sesion"));

    if(sesion) {
        createButtonLogOut();
    } else {
        createButtonLogin();
    }
}

/* Esta es la función que se ejecutaría si no esta la sesión inicia, la cual crea el botón que te lleva a la página donde puedes iniciar sesión. */
function createButtonLogin() {
    $("#sesion").append(
        $("<a>").addClass("header-button").text("Iniciar Sesión").on("click", () => {
            $(location).attr("href","html/login-&-register.html");
        })
    )
}

/* Esta función es la que se ejecuta si esta la sesión iniciada, y crea los botones de cerrar sesión y otro boton que no sirve pero dice que usuario ha iniciado sesión */
function createButtonLogOut() {
    $("#sesion").append(
        $("<a>").addClass("header-button").text("Bienvenido/a " + sesion.user),
        $("<a>").addClass("header-button").text("Cerrar Sesión").on("click", () => {
            logOut();
        })
    )
}

/* Funcion para cerrar sesión, la cual guarda todos los fav, likes y dislikes del usuario, en el propio objeto del usuario, y despues borra la sesión
y recarga la página. */
function logOut() {
    let user = JSON.parse(localStorage.getItem(sesion.user));

    user.fav = [...sesion.fav];
    user.like = [...sesion.like];
    user.dislike = [...sesion.dislike];

    localStorage.setItem(sesion.user, JSON.stringify(user));
    localStorage.removeItem("sesion");

    sesion = " ";

    alert("Se va a cerrar sesión. ¡Hasta pronto!");

    location.reload();
}