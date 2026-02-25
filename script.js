document.addEventListener("DOMContentLoaded", function() {
    const track = document.getElementById('portrait-track');
    const maxPortraitsPossibles = 25; 
    
    let imagesChargees = [];
    let imagesTestees = 0;
    let currentIndex = 0;
    let autoPlayInterval; // Variable pour stocker notre minuterie

    // Chargement dynamique des images
    for (let i = 1; i <= maxPortraitsPossibles; i++) {
        let img = new Image();
        img.src = `visuel/portrait-${i}.jpg`;
        img.alt = `Portrait de l'équipe ${i}`;
        
        img.onload = function() {
            imagesChargees.push({ img: img, index: i });
            verifierFinChargement();
        };
        img.onerror = function() {
            verifierFinChargement();
        };
    }

    function verifierFinChargement() {
        imagesTestees++;
        if (imagesTestees === maxPortraitsPossibles && imagesChargees.length > 0) {
            imagesChargees.sort((a, b) => a.index - b.index);
            construireSlider();
        }
    }

    function construireSlider() {
        imagesChargees.forEach((item) => {
            let div = document.createElement('div');
            div.className = 'slider-item';
            div.appendChild(item.img);
            track.appendChild(div);
        });
        
        mettreAJourSlider();
    }

    // Gère les 3 positions exactes et relance la minuterie
    function mettreAJourSlider() {
        const items = document.querySelectorAll('.slider-item');
        if (items.length === 0) return;

        // On nettoie toutes les classes
        items.forEach(item => {
            item.className = 'slider-item'; 
        });

        // On calcule qui est avant et qui est après (en boucle)
        let prevIndex = (currentIndex - 1 + items.length) % items.length;
        let nextIndex = (currentIndex + 1) % items.length;

        // On distribue les 3 rôles
        items[currentIndex].classList.add('active');
        if (items.length > 1) {
            items[prevIndex].classList.add('prev');
            items[nextIndex].classList.add('next');
        }

        // On relance le chronomètre de 15 secondes pour le mode automatique
        relancerMinuterie();
    }

    function passerAuSuivant() {
        if (imagesChargees.length === 0) return;
        currentIndex = (currentIndex + 1) % imagesChargees.length;
        mettreAJourSlider();
    }

    function passerAuPrecedent() {
        if (imagesChargees.length === 0) return;
        currentIndex = (currentIndex - 1 + imagesChargees.length) % imagesChargees.length;
        mettreAJourSlider();
    }

    // Gestion du défilement automatique
    function relancerMinuterie() {
        clearInterval(autoPlayInterval); // On efface l'ancienne minuterie
        autoPlayInterval = setInterval(() => {
            passerAuSuivant();
        }, 15000); // 15000 ms = 15 secondes
    }

    // Clics sur les flèches
    document.getElementById('nextBtn').addEventListener('click', passerAuSuivant);
    document.getElementById('prevBtn').addEventListener('click', passerAuPrecedent);
});