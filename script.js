// Sidebar Toggle untuk Mobile
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        // Buat overlay
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
        
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // Deteksi IP Address
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipDisplay = document.getElementById('ip-address');
            if (ipDisplay) {
                ipDisplay.textContent = data.ip;
            }
        })
        .catch(error => {
            const ipDisplay = document.getElementById('ip-address');
            if (ipDisplay) {
                ipDisplay.textContent = 'Gagal mendeteksi';
            }
        });
});