// ============================================
// MODAL IMAGE + COPY FUNCTIONALITY
// ============================================

let currentImageUrl = '';
let currentImageTitle = '';

// Buka Modal
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
        
        // Setup download button
        if (downloadBtn) {
            downloadBtn.href = imageUrl;
            downloadBtn.download = title.replace(/\s+/g, '_') + '.jpg';
        }
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

// Tutup Modal
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Copy Gambar ke Clipboard
async function copyImage() {
    if (!currentImageUrl) {
        showToast('Tidak ada gambar untuk di-copy!', 'error');
        return;
    }
    
    const copyBtn = document.querySelector('.btn-copy');
    const originalHTML = copyBtn ? copyBtn.innerHTML : '';
    
    try {
        // Fetch gambar sebagai blob
        const response = await fetch(currentImageUrl);
        
        if (!response.ok) {
            throw new Error('Gagal memuat gambar');
        }
        
        const blob = await response.blob();
        
        // Cek apakah browser support Clipboard API
        if (navigator.clipboard && window.ClipboardItem) {
            const clipboardItem = new ClipboardItem({
                [blob.type]: blob
            });
            await navigator.clipboard.write([clipboardItem]);
            
            // Tampilkan sukses
            if (copyBtn) {
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<span class="copy-icon">✅</span><span class="copy-text">Berhasil Disalin!</span>';
                
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            }
            
            showToast('✅ Gambar berhasil di-copy ke clipboard!', 'success');
        } else {
            // Fallback untuk browser lama - download otomatis
            throw new Error('Clipboard API tidak didukung');
        }
    } catch (error) {
        console.error('Copy error:', error);
        
        // Fallback: buka gambar di tab baru untuk manual copy
        fallbackCopyImage();
    }
}

// Fallback Copy - Buka gambar di tab baru
function fallbackCopyImage() {
    showToast('⚠️ Browser tidak mendukung auto-copy. Gambar akan dibuka di tab baru. Klik kanan → Copy Image', 'error');
    
    setTimeout(() => {
        window.open(currentImageUrl, '_blank');
    }, 1500);
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = 'toast ' + type + ' show';
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Tutup modal saat klik di luar gambar
document.addEventListener('click', function(e) {
    const modal = document.getElementById('imageModal');
    if (e.target === modal) {
        closeImageModal();
    }
});

// Tutup modal dengan tombol ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    }
});

// ============================================
// SIDEBAR TOGGLE (sudah ada sebelumnya)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
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
    
    // Deteksi IP
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipDisplay = document.getElementById('ip-address');
            if (ipDisplay) ipDisplay.textContent = data.ip;
        })
        .catch(() => {
            const ipDisplay = document.getElementById('ip-address');
            if (ipDisplay) ipDisplay.textContent = 'Gagal mendeteksi';
        });
});
