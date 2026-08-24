/* ==========================================================================
   CONFIGURACIÓN DEL CURSOR
   ========================================================================== */

/*
Para cambiar la imagen del cursor, edita SOLO esta línea:
*/
const CURSOR_IMAGE_SRC = "img/mascara.png";

/*
Puedes reemplazarla por cualquier otro archivo, por ejemplo:

const CURSOR_IMAGE_SRC = "img/cursor-ojo.png";

No es necesario tocar el resto de este archivo.
El tamaño, el brillo, el seguimiento y las reacciones
se aplican al contenedor, no a la imagen en sí.
*/

const CURSOR_IMAGE_ALT = "Cursor personalizado en forma de ojo de pulpo";

/* ========================================================================== */

(function () {
    "use strict";

    // En pantallas táctiles o sin mouse de precisión dejamos el cursor nativo.
    var canUseCustomCursor =
        window.matchMedia &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!canUseCustomCursor) return;

    var reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Construcción del cursor ---------- */

    var cursor = document.createElement("div");
    cursor.className = "octo-cursor";
    cursor.setAttribute("aria-hidden", "true");

    /* ---------- Ruedita amarilla pequeña ---------- */

    var glow = document.createElement("div");
    glow.className = "octo-cursor__glow";

    /*
    Ruedita amarilla pequeña y sutil.
    No tiene degradado ni resplandor fuerte.
    */

    glow.style.width = "28px";
    glow.style.height = "28px";
    glow.style.borderRadius = "50%";
    glow.style.background = "#FFD600";
    glow.style.opacity = "0.15";
    glow.style.boxShadow = "none";

    /*
    Asegura que la ruedita quede detrás del ojo.
    */
    glow.style.position = "absolute";
    glow.style.zIndex = "0";
    glow.style.pointerEvents = "none";

    /* ---------- Figura del ojo ---------- */

    var figure = document.createElement("div");
    figure.className = "octo-cursor__figure";

    figure.style.position = "relative";
    figure.style.zIndex = "1";

    var img = document.createElement("img");

    img.className = "octo-cursor__img";
    img.src = CURSOR_IMAGE_SRC;
    img.alt = CURSOR_IMAGE_ALT;
    img.draggable = false;

    /*
    --------------------------------------------------------------------------
    AJUSTE DEL COLOR DEL OJO
    --------------------------------------------------------------------------

    Reduce un poco la intensidad del degradado original del ojo.
    */

    img.style.opacity = "0.75";

    figure.appendChild(img);

    /* ---------- Tooltip ---------- */

    var tooltip = document.createElement("div");
    tooltip.className = "octo-cursor__tooltip";

    /* ---------- Añadir elementos al cursor ---------- */

    cursor.appendChild(glow);
    cursor.appendChild(figure);
    cursor.appendChild(tooltip);

    document.body.appendChild(cursor);

    /* ---------- Movimiento con estela suave ---------- */

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;

    var eyeX = mouseX;
    var eyeY = mouseY;

    var prevEyeX = eyeX;
    var prevEyeY = eyeY;

    var hasMoved = false;

    var lerp = reduceMotion ? 1 : 0.16;

    var TILT_MAX = 10;

    function onMouseMove(e) {

        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!hasMoved) {

            eyeX = mouseX;
            eyeY = mouseY;

            prevEyeX = eyeX;
            prevEyeY = eyeY;

            hasMoved = true;

            cursor.style.opacity = "1";
        }
    }

    window.addEventListener(
        "mousemove",
        onMouseMove,
        { passive: true }
    );

    /* ---------- Ocultar al salir de la página ---------- */

    document.addEventListener(
        "mouseleave",
        function () {
            cursor.style.opacity = "0";
        }
    );

    document.addEventListener(
        "mouseenter",
        function () {

            if (hasMoved) {
                cursor.style.opacity = "1";
            }

        }
    );

    /* ---------- Animación del cursor ---------- */

    function tick() {

        eyeX += (mouseX - eyeX) * lerp;
        eyeY += (mouseY - eyeY) * lerp;

        cursor.style.transform =
            "translate(" +
            eyeX +
            "px, " +
            eyeY +
            "px)";

        if (!reduceMotion) {

            var vx = eyeX - prevEyeX;
            var vy = eyeY - prevEyeY;

            var tilt = Math.max(
                -TILT_MAX,
                Math.min(TILT_MAX, vx * 1.4)
            );

            var lift = Math.max(
                -6,
                Math.min(6, vy * 0.3)
            );

            figure.style.transform =
                "translate(-50%, -50%) " +
                "rotate(" +
                tilt.toFixed(2) +
                "deg) " +
                "translateY(" +
                lift.toFixed(2) +
                "px)";
        }

        prevEyeX = eyeX;
        prevEyeY = eyeY;

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    /* ---------- Reacción a elementos interactivos ---------- */

    var HOVER_SELECTOR = [
        "a",
        "button",
        "input",
        "textarea",
        ".hamburger",
        ".showcase-card",
        ".repertorio-card",
        ".obra-card",
        ".gallery-item",
        ".news-card",
        ".mvv-card",
        ".noticia-mini",
        "[data-cursor]"
    ].join(",");

    /* ---------- Texto del tooltip ---------- */

    function labelFor(el) {

        var custom = el.getAttribute("data-cursor");

        if (custom) {
            return custom;
        }

        var titleEl = el.querySelector(
            ".showcase-body h3, " +
            ".repertorio-title, " +
            ".obra-title, " +
            ".news-title, " +
            ".noticia-mini-title, " +
            "h1, h2, h3"
        );

        if (
            titleEl &&
            titleEl.textContent.trim()
        ) {

            return titleEl.textContent.trim();
        }

        var aria = el.getAttribute("aria-label");

        if (aria) {
            return aria;
        }

        var text = (el.textContent || "")
            .trim()
            .replace(/\s+/g, " ");

        if (text) {

            return text.length > 46
                ? text.slice(0, 46) + "…"
                : text;
        }

        if (
            el.tagName === "IMG" &&
            el.alt
        ) {

            return el.alt;
        }

        return "Explorar";
    }

    /* ---------- Entrada a elementos interactivos ---------- */

    document.addEventListener(
        "mouseover",
        function (e) {

            var target = e.target.closest(HOVER_SELECTOR);

            if (!target) return;

            cursor.classList.add("is-hovering");

            tooltip.textContent = labelFor(target);
        }
    );

    /* ---------- Salida de elementos interactivos ---------- */

    document.addEventListener(
        "mouseout",
        function (e) {

            var target = e.target.closest(HOVER_SELECTOR);

            if (!target) return;

            var toEl = e.relatedTarget;

            if (
                toEl &&
                target.contains(toEl)
            ) {
                return;
            }

            cursor.classList.remove("is-hovering");
        }
    );

    /* ---------- Efecto al hacer clic ---------- */

    document.addEventListener(
        "mousedown",
        function () {

            cursor.classList.add("is-clicking");

        }
    );

    document.addEventListener(
        "mouseup",
        function () {

            window.setTimeout(
                function () {

                    cursor.classList.remove(
                        "is-clicking"
                    );

                },
                140
            );

        }
    );

})();