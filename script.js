
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzqutfSNqwKi9M99-gRkYVizu8ybE4MEulyyDWsfhussVcW5JNxuV9aNWBfHk6XDnE-/exec";

document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. GESTION DE LA POP-UP BOÎTE À IDÉES
    // ==========================================
    const suggModal = document.getElementById("suggestionModal");
    const openBtn = document.getElementById("openSuggestionBtn");
    const closePageBtn = document.getElementById("closeSuggestionPageBtn");
    const formContainer = document.getElementById("suggestionFormContainer");
    const successContainer = document.getElementById("suggestionSuccessContainer");
    const form = document.getElementById("suggestionForm");
    const submitBtn = document.getElementById("submitSuggestionBtn");

    function closeModal() {
        suggModal.style.display = "none";
        document.body.style.overflow = "auto";
        
        // On réinitialise l'affichage pour la prochaine fois
        setTimeout(() => {
            formContainer.style.display = "block";
            successContainer.style.display = "none";
            form.reset();
            document.getElementById('sugg-char-count').textContent = "0";
        }, 300);
    }

    if (openBtn && suggModal) {
        openBtn.addEventListener("click", function() {
            suggModal.style.display = "block";
            document.body.style.overflow = "hidden"; // Empêche de scroller derrière
        });

        closePageBtn.addEventListener("click", closeModal);

        // Ferme si on clique à l'extérieur de la pop-up
        window.addEventListener("click", function(event) {
            if (event.target == suggModal) {
                closeModal();
            }
        });
    }

    // --- COMPTEUR DE CARACTÈRES ---
    const textarea = document.getElementById('sugg-idee');
    const charCount = document.getElementById('sugg-char-count');
    const counterContainer = document.querySelector('.char-counter-suggestion');

    if (textarea) {
        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            if (currentLength >= 500) {
                counterContainer.classList.add('limit-reached');
            } else {
                counterContainer.classList.remove('limit-reached');
            }
        });
    }

    // --- ENVOI DES DONNÉES (FETCH) ---
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (GOOGLE_SCRIPT_URL === "VOTRE_LIEN_GOOGLE_SCRIPT_ICI") {
                alert("Erreur de configuration : Vous n'avez pas mis le lien Google Script dans le fichier script.js !");
                return;
            }

            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Envoi en cours...";
            submitBtn.disabled = true;

            const formData = new FormData(form);

            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            })
            .then(() => {
                // Succès de l'envoi : on cache le formulaire et on affiche les remerciements
                formContainer.style.display = "none";
                successContainer.style.display = "block";
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            })
            .catch(error => {
                submitBtn.textContent = "Erreur de connexion. Réessayez.";
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            });
        });
    }

    // ==========================================
    // 2. GESTION DU CARROUSEL DES PORTRAITS
    // ==========================================
    const track = document.getElementById('portrait-track');
    const maxPortraitsPossibles = 27; 
    
    let imagesChargees = [];
    let imagesTestees = 0;
    let currentIndex = 0;
    let autoPlayInterval; 

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

    function mettreAJourSlider() {
        const items = document.querySelectorAll('.slider-item');
        if (items.length === 0) return;

        items.forEach(item => {
            item.className = 'slider-item'; 
        });

        let prevIndex = (currentIndex - 1 + items.length) % items.length;
        let nextIndex = (currentIndex + 1) % items.length;

        items[currentIndex].classList.add('active');
        if (items.length > 1) {
            items[prevIndex].classList.add('prev');
            items[nextIndex].classList.add('next');
        }

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

    function relancerMinuterie() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            passerAuSuivant();
        }, 15000); 
    }

    // Clics sur les flèches du slider existant
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) nextBtn.addEventListener('click', passerAuSuivant);
    if (prevBtn) prevBtn.addEventListener('click', passerAuPrecedent);

});
