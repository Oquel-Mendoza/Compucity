document.addEventListener("DOMContentLoaded", () => {
    let favoritesList = [];

    // INYECTAR BOTÓN DE CORAZÓN EN CADA TARJETA AUTOMÁTICAMENTE
    const products = document.querySelectorAll('.product-item');
    products.forEach((prod, index) => {
        prod.style.position = 'relative';
        const heartBtn = document.createElement('button');
        heartBtn.className = 'fav-card-btn';
        heartBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`;
        prod.appendChild(heartBtn);

        // Evento para añadir/quitar de favoritos
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = prod.querySelector('p').innerText;
            const imgSrc = prod.querySelector('img').src; // Guardamos la foto en lugar del precio
            const id = "prod_" + index;

            if (heartBtn.classList.contains('active')) {
                heartBtn.classList.remove('active');
                favoritesList = favoritesList.filter(item => item.id !== id);
            } else {
                heartBtn.classList.add('active');
                favoritesList.push({ id, title, imgSrc }); // Se guarda la foto
            }
            updateFavoritesUI();
        });
    });

    // ACTUALIZAR EL CONTADOR Y RENDERIZAR LA TABLA DE FAVORITOS
    function updateFavoritesUI() {
        const favBadge = document.getElementById('favBadge');
        const favsTableContainer = document.getElementById('favsTableContainer');
        
        if (favBadge) favBadge.innerText = favoritesList.length;

        if (favoritesList.length === 0) {
            if (favsTableContainer) favsTableContainer.innerHTML = '<p class="empty-favs-text">No has guardado productos todavía.</p>';
            return;
        }

        // Armamos la estructura de la tabla
        let tableHTML = `
            <table class="fav-table">
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Producto</th>
                        <th style="text-align: right;">Acción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        favoritesList.forEach(item => {
            const phone = "50588024335";
            const message = `Hola Compucity, me interesa este producto de mis favoritos:\n\n*${item.title}*\n\nReferencia: ${item.imgSrc}`;
            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            tableHTML += `
                <tr>
                    <td style="width: 60px;"><img src="${item.imgSrc}" class="fav-thumb" alt=""></td>
                    <td><div class="fav-desc">${item.title}</div></td>
                    <td style="text-align: right; width: 90px;"><a href="${waUrl}" target="_blank" class="fav-action-btn">COTIZAR</a></td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        
        if (favsTableContainer) favsTableContainer.innerHTML = tableHTML;
    }

    // CONTROL DE APERTURA Y CIERRE DEL MODAL CENTRADO
    const btnFavorites = document.getElementById('btnFavorites');
    const closeFavsModal = document.getElementById('closeFavsModal');
    const favModalOverlay = document.getElementById('favModalOverlay');

    if (btnFavorites) {
        btnFavorites.addEventListener('click', () => {
            if (favModalOverlay) {
                favModalOverlay.style.display = 'flex';
                setTimeout(() => favModalOverlay.classList.add('show'), 10);
            }
        });
    }

    const closeFavs = () => {
        if (favModalOverlay) {
            favModalOverlay.classList.remove('show');
            setTimeout(() => favModalOverlay.style.display = 'none', 300);
        }
    };

    if (closeFavsModal) closeFavsModal.addEventListener('click', closeFavs);
    if (favModalOverlay) {
        favModalOverlay.addEventListener('click', (e) => {
            if (e.target === favModalOverlay) closeFavs(); // Cierra si tocan fuera del cuadro
        });
    }

    // BOTÓN RECARGAR (LIMPIAR TODO CON ANIMACIÓN SUAVE)
    const btnRefresh = document.getElementById('btnRefresh');
    if(btnRefresh) {
        btnRefresh.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if(searchInput) searchInput.value = '';
            
            const emptyState = document.getElementById('emptyState');
            if(emptyState) emptyState.style.display = 'none';

            document.querySelectorAll('.sidebar-anchor, .sidebar-link').forEach(el => el.classList.remove('active-filter'));
            const inicioLink = document.querySelector('.sidebar-link[category="all"]');
            if(inicioLink) inicioLink.classList.add('active-filter');

            products.forEach(prod => {
                prod.style.transform = 'scale(0.9)';
                prod.style.opacity = '0';
                setTimeout(() => {
                    prod.style.display = 'flex';
                    setTimeout(() => { prod.style.transform = 'scale(1)'; prod.style.opacity = '1'; }, 50);
                }, 200);
            });
        });
    }

    // COTIZAR INDIVIDUALMENTE POR WHATSAPP (Desde el catálogo principal)
    const cotizarBtns = document.querySelectorAll('.product-item a');
    cotizarBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.product-item');
            const title = card.querySelector('p').innerText;
            const imgSrc = card.querySelector('img').src;
            const phone = "50588024335"; 
            const message = `Hola, me interesa este producto:\n\n*${title}*\n\nReferencia visual: ${imgSrc}`;
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    // ZOOM DE FOTOS (LIGHTBOX)
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.modal-close');
    const productImgs = document.querySelectorAll('.product-item img');

    productImgs.forEach(img => {
        img.addEventListener('click', () => {
            modalImg.src = img.src;
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('show'), 10);
        });
    });
    if(closeBtn) closeBtn.addEventListener('click', () => { modal.classList.remove('show'); setTimeout(() => modal.style.display = 'none', 300); });

    // MENÚ CATEGORÍAS LATERAL
    const menuToggle = document.getElementById('menuToggle');
    const closeMenuBtn = document.getElementById('closeMenu');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if(menuToggle) menuToggle.addEventListener('click', () => { sidebarMenu.classList.add('active'); sidebarOverlay.classList.add('active'); });
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', () => { sidebarMenu.classList.remove('active'); sidebarOverlay.classList.remove('active'); });
    if(sidebarOverlay) sidebarOverlay.addEventListener('click', () => { sidebarMenu.classList.remove('active'); sidebarOverlay.classList.remove('active'); });

    // ACORDEÓN CATEGORÍAS
    const groupTitles = document.querySelectorAll('.sidebar-group-title');
    groupTitles.forEach(title => {
        title.addEventListener('click', () => {
            const parent = title.parentElement;
            document.querySelectorAll('.sidebar-group').forEach(group => { if(group !== parent) group.classList.remove('open'); });
            parent.classList.toggle('open');
        });
    });

    // FILTRADO DESDE EL MENÚ
    const categoryLinks = document.querySelectorAll('.sidebar-link, .sidebar-anchor');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('category');
            document.querySelectorAll('.sidebar-anchor, .sidebar-link').forEach(el => el.classList.remove('active-filter'));
            link.classList.add('active-filter');
            sidebarMenu.classList.remove('active');
            sidebarOverlay.classList.remove('active');

            products.forEach(prod => {
                prod.style.transform = 'scale(0.9)'; prod.style.opacity = '0';
                setTimeout(() => {
                    if(category === 'all' || prod.getAttribute('category') === category) {
                        prod.style.display = 'flex';
                        setTimeout(() => { prod.style.transform = 'scale(1)'; prod.style.opacity = '1'; }, 50);
                    } else { prod.style.display = 'none'; }
                }, 300);
            });
        });
    });

    // BUSCADOR CON FILTRO INTELIGENTE
    const searchInput = document.getElementById('searchInput');
    const emptyState = document.getElementById('emptyState');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            let hasResults = false;
            products.forEach(prod => {
                const text = prod.querySelector('p').innerText.toLowerCase();
                if(text.includes(term)) {
                    prod.style.display = 'flex';
                    setTimeout(() => { prod.style.transform = 'scale(1)'; prod.style.opacity = '1'; }, 10);
                    hasResults = true;
                } else {
                    prod.style.transform = 'scale(0.9)'; prod.style.opacity = '0';
                    setTimeout(() => prod.style.display = 'none', 300);
                }
            });
            if(emptyState) { if(!hasResults && term !== '') { setTimeout(() => emptyState.style.display = 'flex', 300); } else { emptyState.style.display = 'none'; } }
        });
    }

    // BOTÓN VOLVER ARRIBA
    const btnTop = document.getElementById('btnTop');
    window.addEventListener('scroll', () => { if (window.scrollY > 400) btnTop.classList.add('show'); else btnTop.classList.remove('show'); });
    if(btnTop) btnTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // SPLASH SCREEN DE INICIO
  //  const splashScreen = document.getElementById('splashScreen');
   // if (splashScreen) { setTimeout(() => { splashScreen.classList.add('hidden'); setTimeout(() => splashScreen.remove(), 600); }, 2000); }
});
