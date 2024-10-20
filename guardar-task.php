<?php 
// saveTasks.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true); // Obtener los datos de la solicitud

    if ($data) {
        // Leer el archivo JSON existente
        $tasksJson = file_get_contents('tasks.json');
        $tasks = json_decode($tasksJson, true); // Decodificar JSON en un array

        if (!is_array($tasks)) {
            $tasks = []; // Si no es un array, inicializa uno vacío
        }

        $tasks[] = $data; // Agregar la nueva tarea

        // Guardar las tareas actualizadas en el archivo JSON
        file_put_contents('tasks.json', json_encode($tasks));
        echo json_encode(['success' => true]); // Respuesta de éxito
    } else {
        echo json_encode(['success' => false, 'message' => 'No data provided']);
    }
}


?>