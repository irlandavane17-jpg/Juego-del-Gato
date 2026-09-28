// El tablero guarda una marca por casilla; null representa una casilla vacía.
const tablero = Array(9).fill(null);
const combinacionesGanadoras = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
const casillas = Array.from(document.querySelectorAll(".casilla"));
const estado = document.querySelector("#estado");
const marcador = { X: 0, O: 0, empates: 0 };
let jugadorActual = "X";
let partidaTerminada = false;

// Actualiza el anuncio del turno con el color correspondiente a cada jugador.
function mostrarTurno() {
    const clase = jugadorActual === "X" ? "" : "marca-o";
    estado.innerHTML = `Turno de <strong class="${clase}">${jugadorActual}</strong>`;
}

// Busca una combinación completa y devuelve sus posiciones cuando hay ganador.
function buscarCombinacionGanadora() {
    return combinacionesGanadoras.find(([a, b, c]) =>
        tablero[a] && tablero[a] === tablero[b] && tablero[a] === tablero[c]
    );
}

function actualizarMarcador() {
    document.querySelector("#puntos-x").textContent = marcador.X;
    document.querySelector("#puntos-o").textContent = marcador.O;
    document.querySelector("#empates").textContent = marcador.empates;
}

function jugar(posicion) {
    if (partidaTerminada || tablero[posicion] !== null) return;

    tablero[posicion] = jugadorActual;
    const casilla = casillas[posicion];
    casilla.textContent = jugadorActual;
    casilla.dataset.marca = jugadorActual;
    casilla.setAttribute("aria-label", `${casilla.getAttribute("aria-label")}: ${jugadorActual}`);
    casilla.disabled = true;

    const combinacionGanadora = buscarCombinacionGanadora();
    if (combinacionGanadora) {
        partidaTerminada = true;
        combinacionGanadora.forEach(indice => casillas[indice].classList.add("ganadora"));
        marcador[jugadorActual] += 1;
        actualizarMarcador();
        estado.innerHTML = `¡Ganó <strong class="${jugadorActual === "O" ? "marca-o" : ""}">${jugadorActual}</strong>!`;
        casillas.forEach(boton => { boton.disabled = true; });
        return;
    }

    if (tablero.every(celda => celda !== null)) {
        partidaTerminada = true;
        marcador.empates += 1;
        actualizarMarcador();
        estado.textContent = "Empate. ¡Bien jugado!";
        return;
    }

    jugadorActual = jugadorActual === "X" ? "O" : "X";
    mostrarTurno();
}

function iniciarNuevaPartida() {
    tablero.fill(null);
    jugadorActual = "X";
    partidaTerminada = false;
    casillas.forEach((casilla, indice) => {
        casilla.textContent = "";
        casilla.disabled = false;
        casilla.classList.remove("ganadora");
        casilla.removeAttribute("data-marca");
        casilla.setAttribute("aria-label", `Fila ${Math.floor(indice / 3) + 1}, columna ${(indice % 3) + 1}`);
    });
    mostrarTurno();
}

casillas.forEach((casilla, indice) => {
    casilla.addEventListener("click", () => jugar(indice));
});
document.querySelector("#nueva-partida").addEventListener("click", iniciarNuevaPartida);
document.querySelector("#reiniciar-marcador").addEventListener("click", () => {
    marcador.X = 0;
    marcador.O = 0;
    marcador.empates = 0;
    actualizarMarcador();
});

mostrarTurno();
