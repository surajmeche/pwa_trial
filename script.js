let deferredPrompt;
const installBtn = document.getElementById('installBtn');
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isAndroid = /Android/.test(navigator.userAgent);
const isChromium = window.chrome !== null && typeof window.chrome !== 'undefined';

// Detect if app is already installed
const isInstalled = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

if (isInstalled) {
  installBtn.style.display = 'none';
}

// Chrome, Edge, and other Chromium browsers
if (isChromium || isAndroid) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
  });
}

// Safari/iOS instructions
if (isIOS) {
  installBtn.textContent = '📲 Add to Home Screen (Share → Add to Home Screen)';
  installBtn.style.display = 'block';
  installBtn.disabled = true;
  installBtn.style.opacity = '0.7';
}

// Firefox - show custom button
if (navigator.userAgent.includes('Firefox') && !isIOS && !isAndroid) {
  installBtn.style.display = 'block';
}

// Install button click handler
if (installBtn) {
  installBtn.addEventListener('click', async (e) => {
    if (deferredPrompt) {
      // Chrome/Edge/Chromium
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      deferredPrompt = null;
    } else if (isIOS) {
      console.log('iOS: Please use Share → Add to Home Screen');
    } else {
      console.log('Please use your browser menu to install this app');
    }
  });
}

window.addEventListener('appinstalled', () => {
  console.log('PWA installed successfully');
  installBtn.style.display = 'none';
  deferredPrompt = null;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(registration => {
    console.log("Service Worker Registered!");
  }).catch(error => {
    console.log("Service Worker Registration Failed:", error);
  });
}

// Show install prompt if app is not installed and browser supports it
function showInstallPrompt() {
  if (deferredPrompt && !isInstalled) {
    deferredPrompt.prompt();
  }
}