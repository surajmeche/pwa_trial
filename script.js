let deferredPrompt;

// Capture the beforeinstallprompt event early
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent default install popup
  deferredPrompt = e; // Store for later use
  console.log('Install prompt ready');
});

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  deferredPrompt = null;
});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").then(registration =>{
    console.log("SW Registered !");
  }).catch(error =>{
    console.log("SW Registration Failed");
    console.log(error);
  })
}

// Function to show install prompt manually if needed
function showInstallPrompt() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted install');
      }
      deferredPrompt = null;
    });
  }
}