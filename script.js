document.addEventListener('DOMContentLoaded', () => {
    // Creazione del cursore personalizzato
    const cursor = document.createElement('div');
    cursor.classList.add('cursor-ball');
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;

    // RIMOSSO 'LI' da questa lista per evitare che tutto il carosello diventi testo selezionabile
    const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN'];

    // Movimento del mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        const hoveredElement = e.target;
        const tagName = hoveredElement.tagName;

        // Gestione visibilità cursore personalizzato
        if (hoveredElement.classList.contains('carousel-nav') || hoveredElement.classList.contains('dot')) {
            cursor.style.opacity = '0';
        } else {
            if (cursor.dataset.hidden !== 'true') {
                cursor.style.opacity = '1';
            }
        }

        // Logica Hover Link e Bottoni
        if (hoveredElement.closest('a') || hoveredElement.closest('.btn') || hoveredElement.classList.contains('grid-item')) {
            cursor.classList.add('link-hover');
            cursor.classList.remove('text-hover');
        }
        else if (textTags.includes(tagName)) {
            cursor.classList.add('text-hover');
            cursor.classList.remove('link-hover');
        }
        else {
            cursor.classList.remove('text-hover');
            cursor.classList.remove('link-hover');
        }
    });

    // Effetto click
    document.addEventListener('mousedown', () => {
        cursor.classList.add('active');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('active');
    });

    // Nascondi cursore se esce dalla finestra
    document.addEventListener('mouseout', (e) => {
        if (!e.relatedTarget && !e.toElement) {
            cursor.style.opacity = '0';
            cursor.dataset.hidden = 'true';
        }
    });

    document.addEventListener('mouseover', (e) => {
        if (!e.target.classList.contains('carousel-nav') && !e.target.classList.contains('dot')) {
            cursor.style.opacity = '1';
            cursor.dataset.hidden = 'false';
        }
    });

    // --- CAROUSEL LOGIC ---
    const carouselList = document.getElementById('carousel-list');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    if (carouselList && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const itemWidth = carouselList.querySelector('li').clientWidth;
            carouselList.scrollBy({ left: -itemWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const itemWidth = carouselList.querySelector('li').clientWidth;
            carouselList.scrollBy({ left: itemWidth, behavior: 'smooth' });
        });
    }

    // --- GRID IMAGES ---
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        if (!item.style.backgroundImage || item.style.backgroundImage === 'none') {
            const uniqueId = Math.random();
            item.style.backgroundImage = `url('https://picsum.photos/600/400?random=${uniqueId}')`;
        }
    });

    // --- MOBILE GRID REVEAL LOGIC ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const gridObserver = new IntersectionObserver((entries) => {
        if (window.innerWidth <= 900) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-mobile');
                } else {
                    entry.target.classList.remove('active-mobile');
                }
            });
        }
    }, observerOptions);

    gridItems.forEach(item => {
        gridObserver.observe(item);
    });

    // --- CAROUSEL DOTS LOGIC (Nuova Aggiunta) ---
    const dotsContainer = document.querySelector('.carousel-dots');
    const slides = carouselList.querySelectorAll('li');

    if (carouselList && dotsContainer && slides.length > 0) {
        // 1. Generazione dei punti
        slides.forEach((slide, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active'); // Il primo è attivo

            // Click sul punto per scorrere
            dot.addEventListener('click', () => {
                slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            });

            dotsContainer.appendChild(dot);
        });

        // 2. Observer per cambiare il punto attivo mentre si scorre (swipe)
        const dotObserverOptions = {
            root: carouselList, // Osserva dentro la lista
            threshold: 0.5      // Attiva quando il 50% della slide è visibile
        };

        const dotObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trova l'indice della slide visibile
                    const index = Array.from(slides).indexOf(entry.target);

                    // Rimuovi active da tutti i punti
                    const allDots = dotsContainer.querySelectorAll('.dot');
                    allDots.forEach(d => d.classList.remove('active'));

                    // Aggiungi active al punto corretto
                    if (allDots[index]) {
                        allDots[index].classList.add('active');
                    }
                }
            });
        }, dotObserverOptions);

        slides.forEach(slide => dotObserver.observe(slide));
    }
});