const formulario = document.getElementById("gameForm");
const contenedor = document.getElementById("gamesContainer");

formulario.addEventListener("submit", (e) => {

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const genero = document.getElementById("genero").value;
    const plataforma = document.getElementById("plataforma").value;
    const estado = document.getElementById("estado").value;

    const tarjeta = document.createElement("div");

    tarjeta.classList.add("card");

    tarjeta.innerHTML = `
        <h3>${nombre}</h3>
        <p><strong>Género:</strong> ${genero}</p>
        <p><strong>Plataforma:</strong> ${plataforma}</p>
        <p><strong>Estado:</strong> ${estado}</p>
    `;

    contenedor.appendChild(tarjeta);

    formulario.reset();

});