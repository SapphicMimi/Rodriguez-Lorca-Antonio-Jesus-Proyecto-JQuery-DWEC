/* URL con las datos de las dos APIs */
/* Cada una tiene un limite predefinido para que carguen todos los gatos de cada API. */
const URL_CATAPI = "https://api.thecatapi.com/v1/breeds?limit=67";
const URL_CATFACTS = "https://catfact.ninja/breeds?limit=110";
const URL_FACTS = "https://catfact.ninja/facts?max_length=300&limit=20";

/* Variables de comprobación */
/* Estas variables van a servir para establecer la forma en la que se van a ver los gatos. */
let order = "asc";
let layout = "table";
/* Esta variable, va a establecer si se esta scrolleando, para seguir cargando elementos, o crear la cabeza del la lista o tabla de nuevo y cargar los gatos. */
let scrolling = false;

/* Lo primero que voy a hacer, va a ser, establecer el objeto en el almacenamiento local con los datos de los gatos y despues mostrarlos. */
$(() => {
    downloadCats();
    /* Función de Feather Icons, para crear los iconos. */
    feather.replace();
})

/* Función para crear el objeto con los datos de los gatos. */
// Primero voy a comprobar si existe el objeto, si no existe continua. Voy a crear varios arrays para almacenar datos de las dos apis, para luego comprobarlos 
// y juntarlos en uno. Primero hago una llamada a una API, y despues a otra. Como he hecho que la llamada sea asincrona, necesito esperar a que se hagan y terminen
// las dos llamadas, y una vez terminen, compruebo por el dato que tienen en común, la raza, y creo un array con los datos de las dos APIs.
async function downloadCats() {
    if(!(localStorage.getItem("cats"))) {
        let cats1 = [];
        let cats2 = [];

        let catsCombined = [];

        let fcall = $.get(URL_CATAPI).done((cats) => {
            cats.forEach(cat => {
                cats1.push(cat);
            })
        })

        let scall = $.get(URL_CATFACTS).done((catsF) => {
            catsF.data.forEach(catF => {
                cats2.push(catF);
            })
        })

        $.when(fcall, scall).done(function() {
            cats1.forEach(cat => {
                cats2.forEach(catf => {
                    if(cat.name == catf.breed) {
                        // Importante no crear de antemano el campo image, si no despues da error.
                        catsCombined.push({
                            id: cat.id,
                            breed: cat.name,
                            temperament: cat.temperament,
                            description: cat.description,
                            country: catf.country,
                            origin: catf.origin,
                            coat: catf.coat,
                            pattern: catf.pattern
                        })
                    }
                })
            })

            downloadPhotos(catsCombined);
        })
    } else {
        showCats(order, layout);
    }
}

/* Función para Introducir Imagenes de gatos dentro de los objetos dentro del array de objetos. */
/* Para esta funcion, Alicia me ha ayudado un poco ya que no terminaba de salirme la funcion. */
async function downloadPhotos(cats) {
    let call = cats.map(cat => {
        return $.get(`https://api.thecatapi.com/v1/images/search?limit=1&breed_ids=${cat.id}&api_key=live_M47gzo20tpqDsQFQha1HF3m4A5fWJDxO4BWfJdHo8iggEXNy0aQO39nVzgXNJ1OO`)
                .done((photo_col) => {
                    cat.image = (photo_col.map(photo => photo.url)).toString();
                })
    })

    Promise.all(call).then(() => {
        localStorage.setItem('cats', JSON.stringify(cats));
        $("#loading").text(" ");
        showCats(order, layout);
    });
}

/* Función que va a mostrar los gatos */
// En esta funcón controlo, si se van a ver en lista o en tabla, según la variable layout.
// Ya dependiendo de una u otra, llama a la función que crea la lista con los datos de los gatos, o la tabla.
function showCats(order, layout) {
    let cats = JSON.parse(localStorage.getItem("cats"));
    let sortCats = orderCats(cats, order);
    
    if(layout == "list") {
        createList(sortCats);
    } else if(layout == "table") {
        createTable(sortCats);
    }
}

/* Función para ordenar los Gatos */
// Puede ser tanto ascendente como descendente, segun se pase por la variable order.
function orderCats(cats, order) {
    if(order == "asc") {
        cats.sort((a, b) => {
            return a.breed.localeCompare(b.breed);
        })
    } else if(order == "desc") {
        cats.sort((a, b) => {
            return b.breed.localeCompare(a.breed);
        })
    }

    return cats;
}

/* Función que crea la lista con los datos de los gatos */
// Si es necesario, crea la lista desde cero.
// También añado a la imagen y al texto el evento de click, para que cargue la función que te permite ver los detalles del gato clicado.
function createList(cats) {
    if(!scrolling) {
        $("#cats").html(" ");

        let list = $("<table>").addClass("list").attr("id", "list");
        
        $("#cats").append(
            list.append(
                $("<thead>").append(
                    ($("<th>").text("Imagen")), 
                    ($("<th>").text("Gatete")), 
                    ($("<th>").text("Botones"))
                )
            )
        );

        $("#cats").append(
            $(".list").append(
                $("<tbody>").attr("id", "body_list")
            )
        )
    }

    cats.forEach(cat => {
        $("#body_list").append(
            $("<tr>").append(
                $("<td>").append(
                    $("<img>").attr("src", cat.image).addClass("list-image").click(() => {
                        createCat(cats, cat.id);
                    })
                ),
                $("<th>").text(cat.breed).click(() => {
                    createCat(cats, cat.id);
                }),
                $("<td>").append(
                    $("<div>").addClass("list-buttons").append(
                        createLikeButton(cat.id).addClass("list-button"),
                        favButton(cat.id).addClass("list-button"),
                        createDislikeButton(cat.id).addClass("list-button")
                    )
                )
            )
        )
    })
}

/* Función que crea la tabla con los datos de los gatos */
// Si es necesario, crea la tabla desde cero, con su thead.
// También añado a la imagen y al texto el evento de click, para que cargue la función que te permite ver los detalles del gato clicado.
function createTable(cats) {
    if(!scrolling) {
        $("#cats").html(" ");

        let table = $("<ul>").addClass("table").attr("id", "table");
        
        $("#cats").append(table);
    }

    cats.forEach(cat => {
        $("#table").append(
            $("<li>").addClass("table-cat").append(
                $("<img>").attr("src", cat.image).click(() => {
                    createCat(cats, cat.id);
                }),
                $("<div>").addClass("table-info").append(
                    $("<h3>").text(cat.breed).click(() => {
                        createCat(cats, cat.id);
                    })
                ),
                $("<div>").addClass("table-buttoms").append(
                    createLikeButton(cat.id),
                    favButton(cat.id),
                    createDislikeButton(cat.id)
                )
            )
        )
    })
}

/* Función que crea la vista con los detalles del gato elegido. */
async function createCat(cats, id) {
    let factsArr = [];
    let randNum = 0 + Math.floor(Math.random() * 20);

    await $.get(URL_FACTS).done((facts) => {
        facts.data.forEach(factObj => {
            factsArr.push(factObj.fact);
        })
    })

    cats.forEach(cat => {
        if(cat.id == id) {
            $("#cats").html(" ");

            $("#cats").append(
                $("<div>").addClass("one-cat").append(
                    $("<img>").attr("src", cat.image),
                    $("<div>").addClass("one-cat-info").append(
                        $("<div>").addClass("one-cat-text").append(
                            $("<h3>").text(cat.breed),
                            $("<h4>").text("Dato Random sobre los gatos: "+factsArr[randNum]),
                            $("<h5>").text(cat.description),
                            $("<p>").text("Origen: "+cat.origin),
                            $("<p>").text("Pais: "+cat.country),
                            $("<p>").text("Piel: "+cat.coat),
                            $("<p>").text("Patrón: "+cat.pattern),
                            $("<p>").text("Temperamento: "+cat.temperament),
                            
                        ),
                        $("<div>").addClass("one-cat-bottom-layer").append(
                            $("<div>").addClass("one-cat-buttons").append(
                                createLikeButton(cat.id),
                                favButton(cat.id),
                                createDislikeButton(cat.id)
                            )
                        )
                    )
                )
            )
        }
    })
}

/* Botones de Interacción */
/* ----------------------------------------------------------------------------- */
/* Funciones para contar Likes y Dislikes */
function countLikes(id) {
    let likeCount = localStorage.getItem("like-id-" + id);

    if(likeCount == null) {
        likeCount = 0;
    }

    return likeCount;
}

function countDisLikes(id) {
    let dislikeCount = localStorage.getItem("dislike-id-" + id);

    if(dislikeCount == null) {
        dislikeCount = 0;
    }

    return dislikeCount;
}

/* Función para crear los botones de Me gusta */
function createLikeButton(id) {
    let button_like = $("<button>").attr("id", "like-id-" + id);
    let likeCount = countLikes(id);

    if(sesion) {
        if(sesion.dislike.indexOf(id) > -1) {
            button_like.prop("disabled", true);
        }
    }

    if(sesion) {
        if(sesion.like.length == 0) {
            button_like.html("Me Gusta (" + likeCount + ")")
        } else {
            if(sesion.like.indexOf(id) > -1) {
                button_like.html("Te Gusta (" + likeCount + ")")
            } else {
                button_like.html("Me Gusta (" + likeCount + ")")
            }
        }
    } else {
        button_like.html("Me Gusta (" + likeCount + ")")
    }

    button_like.on("click", () => {
        if(sesion) {
            if(sesion.like.indexOf(id) > -1) {
                let likeCountEL = localStorage.getItem("like-id-" + id);
                likeCountEL--;
    
                let index = sesion.like.indexOf(id);
                sesion.like.splice(index, 1);
    
                localStorage.setItem("sesion", JSON.stringify(sesion));
                localStorage.setItem("like-id-" + id, likeCountEL);
    
                button_like.html("Me Gusta (" + likeCountEL + ")")
    
                $("#dislike-id-"+id).prop("disabled", false);
            } else {
                let likeCountEL = localStorage.getItem("like-id-" + id);
                likeCountEL++;
    
                sesion.like.push(id);
    
                localStorage.setItem("sesion", JSON.stringify(sesion));
                localStorage.setItem("like-id-" + id, likeCountEL);
    
                button_like.html("Te Gusta (" + likeCountEL + ")")
    
                $("#dislike-id-"+id).prop("disabled", true);
            }
        } else {
            alert("Para dar me gusta a un elemento, primero tienes que Iniciar Sesión");
        }
    });

    return button_like;
}

/* Funcion para crear los botones de No me gusta */
function createDislikeButton(id) {
    let button_dislike = $("<button>").attr("id", "dislike-id-" + id)
    let dislikeCount = countDisLikes(id);

    if(sesion) {
        if(sesion.like.indexOf(id) > -1) {
            button_dislike.prop("disabled", true);
        }
    }

    if(sesion) {
        if(sesion.dislike.length == 0) {
            button_dislike.html("No me Gusta (" + dislikeCount + ")");
        } else {
            if(sesion.dislike.indexOf(id) > -1) {
                button_dislike.html("No te Gusta (" + dislikeCount + ")");
            } else {
                button_dislike.html("No me Gusta (" + dislikeCount + ")");
            }
        }
    } else {
        button_dislike.html("No me Gusta (" + dislikeCount + ")");
    }

    button_dislike.on("click", () => {
        if(sesion) {
            if(sesion.dislike.indexOf(id) > -1) {
                let dislikeCountEL = localStorage.getItem("dislike-id-" + id);
                dislikeCountEL--;
    
                let index = sesion.dislike.indexOf(id);
                sesion.dislike.splice(index, 1);
    
                localStorage.setItem("sesion", JSON.stringify(sesion));
                localStorage.setItem("dislike-id-" + id, dislikeCountEL);
    
                button_dislike.html("No me Gusta (" + dislikeCountEL + ")");
    
                $("#like-id-"+id).prop("disabled", false);
    
            } else {
                let dislikeCountEL = localStorage.getItem("dislike-id-" + id);
                dislikeCountEL++;
    
                sesion.dislike.push(id);
    
                localStorage.setItem("sesion", JSON.stringify(sesion));
                localStorage.setItem("dislike-id-" + id, dislikeCountEL);
    
                button_dislike.html("No te Gusta (" + dislikeCountEL + ")");
    
                $("#like-id-"+id).prop("disabled", true);
            }
        } else {
            alert("Para dar un no me gusta a un elemento, primero tienes que Iniciar Sesión");
        }
    });

    return button_dislike;
}


/* Función que crea los botones de Favorito */
function favButton(id) {
    let button = $("<button>");

    if(sesion) {
        if(sesion.fav.length == 0) {
            button.html("Favorito <i data-feather='heart'>");
        } else {
            if(sesion.fav.indexOf("cat-" + id) > -1) {
                button.html("Quitar Favorito <i data-feather='heart'>");
            } else {
                button.html("Favorito <i data-feather='heart'>");
            }
        }
    } else {
        button.html("Favorito <i data-feather='heart'>");
    }

    button.on("click", () => {
        if(sesion) {
            if(sesion.fav.length == 0) {
                sesion.fav.push("cat-" + id);
                button.html("Quitar Favorito <i data-feather='heart'>");
            } else {
                if(sesion.fav.indexOf("cat-" + id) > -1) {
                    sesion.fav.splice(sesion.fav.indexOf("cat-"+id), 1);
                    button.html("Favorito <i data-feather='heart'>");
                } else {
                    sesion.fav.push("cat-" + id);
                    button.html("Quitar Favorito <i data-feather='heart'>");
                }
            }
            localStorage.setItem("sesion", JSON.stringify(sesion));

        } else {
            alert("Tienes que Iniciar Sesión para poder agregar este gato a Favoritos.")
        }

        feather.replace();
    })

    return button;
}
/* ----------------------------------------------------------------------------- */

/* Eventos en Click */
/* Cambio el layout y muestro de nuevo los gatos, cambiando la disposición */
$("#b-list").on("click", () => {
    layout = "list";
    scrolling = false
    showCats(order, layout);
});

/* Cambio el layout y muestro de nuevo los gatos, cambiando la disposición */
$("#b-table").on("click", () => {
    layout = "table";
    scrolling = false
    showCats(order, layout);
});

/* Cambio el orden y muestro de nuevo los gatos, su ya mencionado, orden */
$("#b-desc").on("click", () => {
    order = "desc";
    scrolling = false
    showCats(order, layout);
});

/* Cambio el orden y muestro de nuevo los gatos, su ya mencionado, orden */
$("#b-asc").on("click", () => {
    order = "asc";
    scrolling = false
    showCats(order, layout);
});

/* Añado al logo el evento de cargar los gatos de nuevo, como forma de volver a las listas o tablas con los datos de los gatos,
si has entrado a ver los detalles de los gatetes. */
$("#logo").on("click", () => {
    scrolling = false
    showCats(order, layout);
});