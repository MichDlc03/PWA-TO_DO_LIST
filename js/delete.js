document.addEventListener('DOMContentLoaded', () => {
  const taskContainer = document.body;

  taskContainer.addEventListener('click', async (event) => {
    if (event.target.closest('.delete-btn')) {
      const button = event.target.closest('.delete-btn');
      const taskId = button.getAttribute('data-id');

      const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta tarea?');
      if (!confirmDelete) return;

      try {
        const response = await fetch(`http://localhost:3000/tasks/delete/${taskId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          showToast(result.message, 'success');

          setTimeout(() => {
            loadTasks();
          }, 1000); 
        } else {
          const errorData = await response.json();
          showToast(`Error: ${errorData.message}`, 'danger');
        }
      } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        showToast('Ocurrió un error al intentar eliminar la tarea.', 'danger');
      }
    }
  });
});

function showToast(message, type) {
  const toastContainer = document.getElementById('toast-container') || createToastContainer();
  const toastHTML = `
    <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  toastContainer.innerHTML += toastHTML;

  const toastElement = toastContainer.lastElementChild;
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  document.body.appendChild(container);
  return container;
}
