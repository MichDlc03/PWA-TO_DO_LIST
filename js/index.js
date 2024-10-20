const taskList = document.getElementById('taskList');
const newTaskInput = document.getElementById('newTaskInput');
const addTaskBtn = document.getElementById('addTaskBtn');

let db;
const request = indexedDB.open('toDoDatabase', 1);

request.onerror = function(event) {
    console.error('Error al abrir IndexedDB:', event);
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log('Base de datos abierta con éxito:', db);
    loadTasksFromIndexedDB(); 
};

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('task', 'task', { unique: false });
};

function loadTasksFromIndexedDB() {
    if (!db) {
        console.error('Base de datos no está definida.'); 
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

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    displayTasks(tasks);
}

function displayTasks(tasks) {
    taskList.innerHTML = ''; 
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

        deleteBtn.addEventListener('click', () => {
            deleteTaskFromIndexedDB(task.id);
            deleteTaskFromLocalStorage(task.id); 
            loadTasksFromIndexedDB(); 
            loadTasksFromLocalStorage(); 
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

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

function addTaskToLocalStorage(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

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

function deleteTaskFromLocalStorage(id) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}

addTaskBtn.addEventListener('click', function() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        const newTask = { text: taskText };

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
                addTaskToIndexedDB(newTask); 
                addTaskToLocalStorage(newTask); 
                loadTasksFromIndexedDB(); 
                loadTasksFromLocalStorage(); 
                newTaskInput.value = ''; 
            }
        })
        .catch(error => console.error('Error al guardar la tarea:', error));
    }
});

loadTasksFromLocalStorage();
