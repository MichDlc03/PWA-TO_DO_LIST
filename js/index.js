async function saveTask() {
    const taskInput = document.getElementById('taskInput');
    const tarea = taskInput.value;

    if (!tarea) {
       console.log('Por favor, ingrese una tarea.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tarea: tarea,
                estado: 'pendiente',
            }),
        });

        if (response.ok) {
           console.log('Tarea guardada exitosamente');
            taskInput.value = '';

            // Get the modal instance and hide it if it's found
            const modalElement = document.getElementById('exampleModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.hide();
                modalElement.addEventListener('hidden.bs.modal', () => {
                    window.location.reload();
                });
            } else {
                console.error('Modal element not found');
            }
        } else {
            const errorText = await response.text();
           console.log(`Error al guardar la tarea: ${errorText}`);
        }
    } catch (error) {
        console.error('Error:', error);
       console.log('Error al guardar la tarea. Asegúrate de que el servidor esté activo.');
    }
}


async function loadTasks() {
    try {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();

    const tasksTableBody = document.getElementById('tasks-table-body');
    tasksTableBody.innerHTML = '';

    tasks.forEach(task => {
    const taskRow = document.createElement('tr');

    taskRow.innerHTML = `
        <td class="text-start">${task.tarea}</td>
        <td>${new Date(task.fecha_de_creacion).toLocaleDateString()}</td>
        <td class="text-center justify-content-center align-content-center">
        <select class="form-select form-control-sm rounded-2 ms-4   w-75">
            <option ${task.estado === 'pendiente' ? 'selected' : ''} value="pendiente">Pendiente</option>
            <option ${task.estado === 'en progreso' ? 'selected' : ''} value="en progreso">En curso</option>
            <option ${task.estado === 'completada' ? 'selected' : ''} value="completada">Completado</option>
        </select>
        </td>
        <td>
        <button class="btn btn-primary mr-2 edit-btn" data-bs-toggle="modal" data-bs-target="#exampleModal1"><i class="fa far fa-edit"></i></button>
        <button class="btn btn-danger delete-btn" data-id="${task._id}"><i class="fa fa-solid fa-trash"></i></button>
        </td>
    `;

    tasksTableBody.appendChild(taskRow);
    });
} catch (error) {
    console.error('Error al cargar las tareas:', error);
}
}

loadTasks();
  