



//SECTION - NOS MIEL- TOP VENTES ****************



document.addEventListener('DOMContentLoaded', function() {
        const videoContainers = document.querySelectorAll('.video-container');
        
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            const overlay = container.querySelector('.video-overlay');
            const playPauseBtn = container.querySelector('.play-pause');
            const rewindBtn = container.querySelector('.rewind');
            const forwardBtn = container.querySelector('.forward');
            
            // Initialisation
            video.controls = false;
            video.currentTime = 0.1;
            video.pause();
            
            // Gestion de l'overlay
            overlay.addEventListener('click', function() {
                video.play();
                overlay.style.opacity = '0';
                overlay.style.pointerEvents = 'none';
                playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            });
            
            // Gestion du bouton Play/Pause
            playPauseBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (video.paused) {
                    video.play()
                        .then(() => {
                            playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                            overlay.style.opacity = '0';
                            overlay.style.pointerEvents = 'none';
                        })
                        .catch(error => {
                            console.error("Erreur de lecture:", error);
                            video.controls = true;
                        });
                } else {
                    video.pause();
                    playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
                }
            });
            
            // Gestion du Rewind
            rewindBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                video.currentTime = Math.max(0, video.currentTime - 10);
            });
            
            // Gestion du Forward
            forwardBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
            });
            
            // Mise à jour de l'icône play/pause
            video.addEventListener('play', function() {
                playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            });
            
            video.addEventListener('pause', function() {
                playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
            });
            
            // Réafficher l'overlay quand la vidéo se termine
            video.addEventListener('ended', function() {
                overlay.style.opacity = '1';
                overlay.style.pointerEvents = 'auto';
                video.currentTime = 0.1;
            });
            
            // Gestion des erreurs
            video.addEventListener('error', function() {
                console.error("Erreur vidéo:", video.error);
            });
        });
    });







    







// SECTION PARRAINAGE ***********************************

//MAIN CARD************************

function adaptTabsForMobile() {
    const isMobile = window.innerWidth <= 768;
    const tabContent = document.querySelector('.tab-content');
    
    // Gestion des titres
    document.querySelectorAll('.h3-parrainage').forEach(title => {
        if (isMobile) {
            // Stocker le texte original si ce n'est pas déjà fait
            if (!title.dataset.originalText) {
                title.dataset.originalText = title.textContent;
            }
            // Garder seulement l'emoji (premier caractère non alphanumérique)
            title.textContent = title.textContent.replace(/^([^\w\s]+).*/, '$1');
        } else {
            // Restaurer le texte original si disponible
            if (title.dataset.originalText) {
                title.textContent = title.dataset.originalText;
            }
        }
    });
    
    // Gestion des paragraphes
    document.querySelectorAll('.p-main-card').forEach(paragraph => {
        paragraph.style.display = isMobile ? 'none' : 'block';
    });
    
    // Gestion des onglets (li.nav-item)
    document.querySelectorAll('#parrainage-tabs .nav-item').forEach(tab => {
        const link = tab.querySelector('.nav-link');
        if (isMobile) {
            if (!link.dataset.originalText) {
                link.dataset.originalText = link.innerHTML;
            }
            // Garder seulement l'emoji
            link.innerHTML = link.textContent.replace(/^([^\w\s]+).*/, '$1');
        } else {
            if (link.dataset.originalText) {
                link.innerHTML = link.dataset.originalText;
            }
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', adaptTabsForMobile);
window.addEventListener('resize', adaptTabsForMobile);

// Réinitialiser après changement d'onglet
document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', adaptTabsForMobile);
});


