let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Detect device
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);
const isInstalled =
  window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

// Hide button if already installed
if (isInstalled) {
  installBtn.style.display = 'none';
}

// Chrome / Edge install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

// iOS manual install
if (isIOS) {
  installBtn.style.display = 'block';
  installBtn.textContent = '📲 iOS: Share → Add to Home Screen';
  installBtn.disabled = true;
  installBtn.style.opacity = '0.7';
}

// Install button click
installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User choice:", outcome);
    deferredPrompt = null;
  }
});

// Installed event
window.addEventListener('appinstalled', () => {
  console.log('PWA installed!');
  installBtn.style.display = 'none';
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW failed:", err));
}