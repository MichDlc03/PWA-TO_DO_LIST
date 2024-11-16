let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevenimos que se muestre el mensaje predeterminado de instalación
  e.preventDefault();
  // Guardamos el evento para que lo podamos usar después
  deferredPrompt = e;
  // Aquí puedes mostrar tu botón de instalación en la UI
  const installButton = document.getElementById('install-button');
  installButton.style.display = 'block';

  installButton.addEventListener('click', () => {
    // Mostrar el cuadro de diálogo para instalar la PWA
    deferredPrompt.prompt();

    // Esperamos la respuesta del usuario
    deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuario aceptó la instalación');
        } else {
          console.log('Usuario rechazó la instalación');
        }
        deferredPrompt = null; // Limpiar el evento
      });
  });
});
