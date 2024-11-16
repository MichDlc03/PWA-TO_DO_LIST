async function saveTaskOffline(tarea) {
    const offlineTasks = JSON.parse(localStorage.getItem('offlineTasks')) || [];
    offlineTasks.push({
        tarea: tarea,
        estado: 'pendiente',
        fecha_de_creacion: new Date().toISOString(), 
    });

    localStorage.setItem('offlineTasks', JSON.stringify(offlineTasks));

    console.log('Tarea guardada localmente');

    syncOfflineTasks();
}

window.addEventListener('online', syncOfflineTasks);

async function syncOfflineTasks() {
    const offlineTasks = JSON.parse(localStorage.getItem('offlineTasks')) || [];

    if (offlineTasks.length > 0) {
        try {
            const response = await fetch('http://localhost:3000/tasks/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks: offlineTasks }),
            });

            if (response.ok) {
                console.log('Tareas sincronizadas con éxito');
                localStorage.removeItem('offlineTasks');
                loadTasks(); 
            } else {
                console.error('Error al sincronizar las tareas');
            }
        } catch (error) {
            console.error('Error al sincronizar las tareas:', error);
        }
    }
}

async function saveTask() {
    const taskInput = document.getElementById('taskInput');
    const tarea = taskInput.value;

    if (!tarea) {
        console.log('Por favor, ingrese una tarea.');
        return;
    }

    if (navigator.onLine) {
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
                loadTasks(); 
            } else {
                const errorText = await response.text();
                console.log(`Error al guardar la tarea: ${errorText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Error al guardar la tarea. Asegúrate de que el servidor esté activo.');
        }
    } else {
        saveTaskOffline(tarea);
    }
}

async function loadTasks() {
    try {
        const response = await fetch('http://localhost:3000/tasks');
        const tasks = await response.json();
        console.log('Tareas cargadas desde el servidor:', tasks);
    } catch (error) {
        console.error('Error al cargar las tareas:', error);
    }
}

window.onload = loadTasks;
