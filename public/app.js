const API_URL = '/api/games';

const form = document.getElementById('game-form');
const gamesGrid = document.getElementById('games-grid');
const btnCancel = document.getElementById('btn-cancel');
const btnSubmit = document.getElementById('btn-submit');

document.addEventListener('DOMContentLoaded', loadGames);

async function loadGames() {
    const res = await fetch(API_URL);
    const games = await res.json();
    gamesGrid.innerHTML = '';

    games.forEach(game => {
        
        const imgUrl = game.imagen_url || 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=500&q=80';
        
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${imgUrl}" alt="${game.titulo}" class="game-image">
            <div class="game-info">
                <h3>${game.titulo}</h3>
                <p><strong>Género:</strong> ${game.genero}</p>
                <p><strong>Plataforma:</strong> ${game.plataforma}</p>
                <p><strong>Estado:</strong> ${game.estado}</p>
            </div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editGame(${game.id}, '${game.titulo}', '${game.genero}', '${game.plataforma}', '${game.estado}', '${game.imagen_url || ''}')">Editar</button>
                <button class="btn-delete" onclick="deleteGame(${game.id})">Eliminar</button>
            </div>
        `;
        gamesGrid.appendChild(card);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('game-id').value;
    
    const gameData = {
        titulo: document.getElementById('titulo').value,
        genero: document.getElementById('genero').value,
        plataforma: document.getElementById('plataforma').value,
        imagen_url: document.getElementById('imagen').value,
        estado: document.getElementById('estado').value
    };

    if (id) {
        
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });
    } else {
        
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });
    }

    form.reset();
    resetFormState();
    loadGames();
});

window.editGame = (id, titulo, genero, plataforma, estado, imagen) => {
    document.getElementById('game-id').value = id;
    document.getElementById('titulo').value = titulo;
    document.getElementById('genero').value = genero;
    document.getElementById('plataforma').value = plataforma;
    document.getElementById('estado').value = estado;
    document.getElementById('imagen').value = imagen !== 'null' ? imagen : '';
    
    btnSubmit.textContent = 'Actualizar Juego';
    btnCancel.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla al formulario
};

btnCancel.addEventListener('click', resetFormState);

function resetFormState() {
    form.reset();
    document.getElementById('game-id').value = '';
    btnSubmit.textContent = 'Guardar juego';
    btnCancel.style.display = 'none';
}

window.deleteGame = async (id) => {
    if (confirm('¿Estás seguro de eliminar este juego?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadGames();
    }
};