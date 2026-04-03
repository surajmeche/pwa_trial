let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Detect device
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isAndroid = /Android/.test(navigator.userAgent);
const isInstalled =
  window.navigator.standalone === true ||
  window.matchMedia('(display-mode: standalone)').matches;

// Hide install button by default (using auto-popup instead)
if (isInstalled) {
  installBtn.style.display = 'none';
} else {
  // Only show button for iOS (needs manual steps)
  if (isIOS) {
    installBtn.style.display = 'block';
  } else {
    // Other browsers: hide button, use auto-popup
    installBtn.style.display = 'none';
  }
}

// Chrome / Edge / Brave - Auto-show install popup (no button needed)
window.addEventListener('beforeinstallprompt', async (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // Auto-show the prompt after 2 seconds (gives page time to load)
  setTimeout(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("Install outcome:", outcome);
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    }
  }, 2000);
});

// iOS manual install - only for iOS devices
if (isIOS) {
  installBtn.style.display = 'block';
  installBtn.textContent = '📲 iOS: Share → Add to Home Screen';
  installBtn.disabled = true;
  installBtn.style.opacity = '0.7';
}

// Install button click (fallback if auto-prompt fails or user wants to install again)
if (!isIOS && installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("Manual install choice:", outcome);
      deferredPrompt = null;
    } else {
      console.log('Install prompt not available');
    }
  });
}

// Event: PWA successfully installed
window.addEventListener('appinstalled', () => {
  console.log(' PWA installed successfully!');
  if (!isIOS) {
    installBtn.style.display = 'none';
  }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW failed:", err));
}