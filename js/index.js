let currentPage = 1;
const itemsPerPage = 5;  // O el número que quieras asignar

const searchInput = document.getElementById('input'); // Campo de búsqueda
searchInput.addEventListener('input', debounceSearch);

function debounceSearch() {
    clearTimeout(window.searchTimeout); // Limpiamos el timeout anterior
    window.searchTimeout = setTimeout(() => {
        const searchText = searchInput.value;
        loadTasks(1, itemsPerPage, searchText); // Cargar tareas con el texto de búsqueda
    }, 300); // Esperar 300ms antes de hacer la búsqueda
}

async function loadTasks(page = 1, limit = itemsPerPage, search = '') {
    try {
        const response = await fetch(`http://localhost:3000/tasks?page=${page}&limit=${limit}&search=${search}`);
        const data = await response.json();
        const tasks = data.tasks;
        const totalPages = Math.ceil(data.total / itemsPerPage);

        const tasksTableBody = document.getElementById('tasks-table-body');
        tasksTableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

        tasks.forEach(task => {
            const taskRow = document.createElement('tr');
            taskRow.innerHTML = `
                <td class="text-start">${task.tarea}</td>
                <td class="text-center">${new Date(task.fecha_de_creacion).toLocaleDateString()}</td>
                <td class="text-center">
                    <select class="form-select form-control-sm rounded-2 w-75 mx-auto" data-id="${task._id}">
                        <option ${task.estado === 'pendiente' ? 'selected' : ''} value="pendiente">Pendiente</option>
                        <option ${task.estado === 'en progreso' ? 'selected' : ''} value="en progreso">En curso</option>
                        <option ${task.estado === 'completada' ? 'selected' : ''} value="completada">Completado</option>
                    </select>
                </td>
                <td class="text-center">
                    <div class="d-flex justify-content-center flex-wrap">
                    <button class="button mr-2 edit-btn mb-2 mb-md-0" data-bs-toggle="modal" data-bs-target="#exampleModal1" data-id="${task._id}">
                        <i class="bi bi-pencil-square"></i> Editar
                    </button>
                    <button class="button delete-btn" data-id="${task._id}">
                        <i class="bi bi-trash3"></i> Eliminar
                    </button>
                    </div>

                </td>

            `;
            tasksTableBody.appendChild(taskRow);

            const statusSelect = taskRow.querySelector('select');
            statusSelect.addEventListener('change', handleStateChange);
        });

        renderPagination(totalPages);
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
    }
}
async function handleStateChange(event) {
    const selectElement = event.target;
    const taskId = selectElement.getAttribute('data-id');
    const newState = selectElement.value;

    if (!taskId) {
        console.error('No se encontró el ID de la tarea');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: newState })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al actualizar la tarea:', errorData.message);
        } else {
            console.log('Tarea actualizada correctamente');
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}

function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.classList.add('btn', 'btn-light', 'm-1');
        pageButton.innerText = i;
        pageButton.disabled = i === currentPage;

        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadTasks(currentPage, itemsPerPage);
        });

        paginationContainer.appendChild(pageButton);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});
async function loadTaskToEdit(taskId) {
    console.log('ID de tarea:', taskId);  
    try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Error al cargar la tarea');
        }

        const task = await response.json();
        console.log('Tarea cargada:', task);  
        document.getElementById('taskInput1').value = task.tarea;
        const saveButton = document.getElementById('saveChangesBtn');
        saveButton.setAttribute('data-id', task._id);
    } catch (error) {
        console.error('Error al cargar la tarea para editar:', error);
    }
}

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        const taskId = event.target.getAttribute('data-id');
        console.log('taskId en el click:', taskId); 
        loadTaskToEdit(taskId);
        
        const modal = new bootstrap.Modal(document.getElementById('exampleModal1'));
        modal.show();
    }
});

document.getElementById('saveChangesBtn').addEventListener('click', async (event) => {
    const button = event.target;
    const taskId = button.getAttribute('data-id'); 

    if (!taskId) {
        console.error('No se encontró el ID de la tarea.');
        return;  
    }

    const updatedTask = {
        tarea: document.getElementById('taskInput1').value 
    };

    try {
        const response = await fetch(`http://localhost:3000/task/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la tarea');
        }

        console.log('Tarea actualizada correctamente');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal1'));
        modal.hide();  
        loadTasks();

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove(); 
        }


    } catch (error) {
        console.error('Error al actualizar la tarea:', error);
    }
});
document.querySelector('[data-bs-dismiss="modal"]').addEventListener('click', () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal1'));
    modal.hide();  // Close the modal when the "Cerrar" button is clicked/ Close the modal when the "Cerrar" button is clicked

    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();  // Remove the backdrop
    }
});


