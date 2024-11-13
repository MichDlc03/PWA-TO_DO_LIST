let weekCount = 1;

function addWeekCard() {
    const container = document.getElementById('cardContainer');

    // Crear nueva columna y tarjeta
    const newCol = document.createElement('div');
    newCol.classList.add('col-md-3', 'col-sm-6', 'mt-5');

    const newCard = document.createElement('a');
    newCard.classList.add('card', 'week-card', 'shadow-sm');
    newCard.href = `weeks.html?week=${weekCount}`;

    const cardContent = document.createElement('div');
    cardContent.classList.add('justify-content-center', 'align-content-center', 'p-5');
    cardContent.textContent = `Semana ${weekCount}`;

    newCard.appendChild(cardContent);
    newCol.appendChild(newCard);
    container.appendChild(newCol);

    const semanaData = {
        semana: weekCount,
        texto: '',  // Aquí puedes agregar el texto que desees
        estado: 'pendiente',  // Estado de la tarea
        fecha_de_creacion: new Date(),  // Fecha de creación (actual)
    };
    

    fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(semanaData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Semana guardada:', data);
    })
    .catch(error => {
        console.error('Error al guardar semana:', error);
    });

    weekCount++;
}
