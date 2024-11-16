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

            const modalElement = document.getElementById('exampleModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.hide();

                loadTasks();
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
