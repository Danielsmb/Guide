// ============================================
// MODAL + COPY FUNCTIONALITY
// ============================================

let currentImageUrl = '';
let currentImageTitle = '';

function openImageModal(imageUrl, title) {
    currentImageUrl = imageUrl;
    currentImageTitle = title;
    
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (modal && modalImage && modalTitle) {
        modalImage.src = imageUrl;
        modalTitle.textContent = title;
        modal.classList.add('active');
        
        if (downloadBtn) {
            downloadBtn.href = imageUrl;
            downloadBtn.download = title.replace(/\s+/g, '_') + '.jpg';
        }
        
        document.body.style.overflow = 'hidden';
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

async function copyImage() {
    if (!currentImageUrl) {
        showToast('Tidak ada gambar untuk di-copy!', 'error');
        return;
    }
    
    const copyBtn = document.getElementById('copyBtn');
    const originalHTML = copyBtn ? copyBtn.innerHTML : '';
    
    try {
        const response = await fetch(currentImageUrl);
        if (!response.ok) throw new Error('Gagal memuat gambar');
        
        const blob = await response.blob();
        
        if (navigator.clipboard && window.ClipboardItem) {
            const clipboardItem = new ClipboardItem({ [blob.type]: blob });
            await navigator.clipboard.write([clipboardItem]);
            
            if (copyBtn) {
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = `
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Berhasil Disalin!</span>
                `;
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            }
            
            showToast('✅ Gambar berhasil di-copy!', 'success');
        } else {
            throw new Error('Clipboard API tidak didukung');
        }
    } catch (error) {
        console.error('Copy error:', error);
        showToast('⚠️ Buka gambar di tab baru untuk copy manual', 'error');
        setTimeout(() => window.open(currentImageUrl, '_blank'), 1200);
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }
        
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
    
    // ESC untuk tutup modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeImageModal();
    });
    
    // Deteksi IP
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(data => {
            const ip = document.getElementById('ip-address');
            if (ip) ip.textContent = data.ip;
        })
        .catch(() => {
            const ip = document.getElementById('ip-address');
            if (ip) ip.textContent = 'Gagal mendeteksi';
        });
});
