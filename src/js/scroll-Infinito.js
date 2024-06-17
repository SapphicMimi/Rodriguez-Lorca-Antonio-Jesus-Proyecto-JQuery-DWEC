// $(window).scrollTop() -> Nos indica la cantidad de pixeles nos hemos desplazado del principio de la página, hasta el final
// $(document).height() -> Nos indica el tamaño total de la página.
// $(window).height() -> Nos indica el tamaño de la ventana del navegador.
// Cuando llegamos al final del documento, la propiedad $(window).scrollTop(), es mas grande que el tamaño total de la página, ya que este esta siendo reducido por
// el tamaño de la ventana, para que al llegar al final, se carguen los gatos de nuevo.
$(window).on("scroll", () => {
    if($(window).scrollTop() >= $(document).height() - $(window).height()) {
        scrolling = true;
        showCats(order, layout);
    }
})