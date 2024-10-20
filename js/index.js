const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

// IndexedDB setup
let db;
const request = indexedDB.open('toDoDatabase', 1);

request.onerror = function(event) {
    console.error('Error al abrir IndexedDB:', event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log('Base de datos abierta con éxito:', db);
    loadTasksFromIndexedDB(); // Cargar las tareas guardadas cuando se abre la base de datos
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('task', 'task', { unique: false });
};

// Obtener tareas desde IndexedDB
function loadTasksFromIndexedDB() {
    if (!db) {
        console.error('Base de datos no está definida.'); // Manejo de error si db no está definido
        return;
    }

    const transaction = db.transaction(['tasks'], 'readonly');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const tasks = event.target.result;
        displayTasks(tasks);
    };

    request.onerror = function(event) {
        console.error('Error al cargar tareas:', event);
    };
}

// Obtener tareas desde Local Storage
function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks(tasks);
}

// Función para mostrar las tareas en la lista
function displayTasks(tasks) {
    taskList.innerHTML = ''; // Limpia la lista antes de mostrar
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.style.fontWeight = 'bold';
        li.textContent = '📝 ' + task.text;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar 🗑️';
        deleteBtn.style.backgroundColor = 'black';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.padding = '5px';
        deleteBtn.style.borderRadius = '5px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.marginLeft = '10px';

        // Evento para eliminar la tarea
        deleteBtn.addEventListener('click', () => {
            deleteTaskFromIndexedDB(task.id);
            deleteTaskFromLocalStorage(task.id); // Eliminar de Local Storage
            loadTasksFromIndexedDB(); // Vuelve a cargar las tareas después de eliminar
            loadTasksFromLocalStorage(); // También vuelve a cargar desde Local Storage
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Guardar tareas en IndexedDB
function addTaskToIndexedDB(task) {
    const transaction = db.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.add(task);

    request.onsuccess = function() {
        console.log('Tarea añadida a IndexedDB:', task.text);
    };

    request.onerror = function(event) {
        console.error('Error al añadir tarea:', event);
    };
}

// Guardar tareas en Local Storage
function addTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Eliminar tarea de IndexedDB
function deleteTaskFromIndexedDB(id) {
    const transaction = db.transaction(['tasks'], 'readwrite');
    const objectStore = transaction.objectStore('tasks');
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        console.log('Tarea eliminada de IndexedDB:', id);
    };

    request.onerror = function(event) {
        console.error('Error al eliminar tarea:', event);
    };
}

// Eliminar tarea de Local Storage
function deleteTaskFromLocalStorage(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

addTaskBtn.addEventListener('click', function() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        const newTask = { text: taskText };

        // Enviar tarea al servidor
        fetch('guardar-task.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                addTaskToIndexedDB(newTask); // Guarda también en IndexedDB
                addTaskToLocalStorage(newTask); // Guarda también en Local Storage
                loadTasksFromIndexedDB(); // Vuelve a cargar las tareas después de agregar
                loadTasksFromLocalStorage(); // Vuelve a cargar desde Local Storage
                newTaskInput.value = ''; // Limpia el input
            }
        })
        .catch(error => console.error('Error al guardar la tarea:', error));
    }
});

// Cargar tareas desde Local Storage al inicio
loadTasksFromLocalStorage();
