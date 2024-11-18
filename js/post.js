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
            }
            loadTasks();
            enviarNotificacion('Nueva tarea agregada', {
                body: `La tarea "${tarea}" fue agregada exitosamente.`,
                icon: 'img/maskable_icon_x192.png',
                actions: [
                    { action: 'ver', title: 'Ver tareas' },
                    { action: 'cerrar', title: 'Cerrar' }
                ],
                requireInteraction: true
            });
        } else {
            const errorText = await response.text();
            console.log(`Error al guardar la tarea: ${errorText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        console.log('Error al guardar la tarea. Asegúrate de que el servidor esté activo.');
    }
}

function enviarNotificacion(titulo, opciones) {
    if ('Notification' in window && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(titulo, opciones);
        });
    } else if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(titulo, opciones);
                });
            } else {
                console.error('Permiso denegado para notificaciones.');
            }
        });
    } else {
        console.warn('Notificaciones no soportadas o permiso denegado.');
    }
}
