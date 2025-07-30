/**
 * Puzzle Gallery (re-usable)
 * Usage:
 *  import { createGallery } from './gallery.js'
 *  const g = createGallery(document.querySelector('#myGallery'), { images: [...] })
 *  g.setImages([...]) / await g.loadFrom('/api/images.json')
 */
export function createGallery(container, options = {}) {
    if (!container) throw new Error('container is required');
    // --- options ---
    const {
        images = [],
        getAlt = (item, i) => item.alt || `Image ${i + 1}`,
        getSrc = (item) => typeof item === 'string' ? item : item.src,
        getLabel = (item) => (typeof item === 'object' && item.alt) ? item.alt : '',
        gridMin = null,     // allow per-page overrides
        autoRow = null,
    } = options;

    // set root class
    container.classList.add('pg');

    // create grid + modal once
    const grid = document.createElement('section');
    grid.className = 'pg-grid';
    grid.setAttribute('aria-label', 'Gallery');

    const modal = document.createElement('div');
    modal.className = 'pg-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
    <div class="pg-stage">
      <div class="pg-main">
        <button class="pg-close" aria-label="Close (Esc)">✕</button>
        <button class="pg-btn pg-prev" aria-label="Previous (←)">❮</button>
        <img class="pg-img" alt="" />
        <button class="pg-btn pg-next" aria-label="Next (→)">❯</button>
      </div>
      <div class="pg-strip">
        <div class="pg-thumbs" aria-label="Image navigator"></div>
      </div>
    </div>
  `;

    container.appendChild(grid);
    container.appendChild(modal);

    // per-instance CSS overrides
    if (gridMin) grid.style.setProperty('--pg-grid-min', gridMin);
    if (autoRow) grid.style.setProperty('--pg-auto-row', autoRow);

    // state
    let ITEMS = [];
    let currentIndex = 0;

    // elements
    const modalImg = modal.querySelector('.pg-img');
    const thumbsEl = modal.querySelector('.pg-thumbs');
    const closeBtn = modal.querySelector('.pg-close');
    const prevBtn = modal.querySelector('.pg-prev');
    const nextBtn = modal.querySelector('.pg-next');

    // helpers (masonry sizing)
    function resizeGridItem(item) {
        const rowHeight = parseFloat(getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        const rowGap = parseFloat(getComputedStyle(grid).getPropertyValue('gap'));
        const imgEl = item.querySelector('img');
        const labelEl = item.querySelector('.pg-label');
        const contentH = (imgEl?.getBoundingClientRect().height || 0) + (labelEl?.getBoundingClientRect().height || 0);
        const span = Math.ceil((contentH + rowGap) / (rowHeight + rowGap));
        item.style.gridRowEnd = `span ${span}`;
    }

    function resizeAll() {
        grid.querySelectorAll('.pg-card').forEach(resizeGridItem);
    }

    window.addEventListener('resize', () => {
        clearTimeout(window.__pgRaf);
        window.__pgRaf = setTimeout(resizeAll, 100);
    });

    // modal logic
    function normalize(i) {
        const n = ITEMS.length;
        return ((i % n) + n) % n;
    }

    function setActiveThumb() {
        thumbsEl.querySelectorAll('.pg-thumb').forEach(t => t.classList.remove('active'));
        const a = thumbsEl.querySelector(`.pg-thumb[data-i="${currentIndex}"]`);
        if (a) a.classList.add('active');
    }

    function ensureThumbVisible() {
        const a = thumbsEl.querySelector(`.pg-thumb[data-i="${currentIndex}"]`);
        if (!a) return;
        thumbsEl.scrollTo({
            left: a.offsetLeft - thumbsEl.clientWidth / 2 + a.clientWidth / 2,
            behavior: 'smooth'
        });
    }

    // Lazy-upgrade to full-res when in view
    const pgIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            pgIO.unobserve(el);
            // Avoid re-setting if already full
            if (el.dataset.fullSrc && el.src !== el.dataset.fullSrc) {
                const full = new Image();
                full.src = el.dataset.fullSrc;
                full.decode?.().catch(() => {
                })  // avoid blocking if decode unsupported
                    .finally(() => {
                        el.src = el.dataset.fullSrc;
                    }); // swap to full
            }
        });
    }, {rootMargin: '200px 0px'});

    function ensureFullImage(imgEl) {
        // If no blur provided, mark ready immediately
        if (!imgEl.dataset.fullSrc || imgEl.src === imgEl.dataset.fullSrc) {
            imgEl.classList.add('pg-img-ready');
            return;
        }
        pgIO.observe(imgEl);
    }

    function setFullAndReady(imgEl, fullUrl) {
        // If already full, just mark ready
        if (imgEl.src === fullUrl) {
            imgEl.classList.add('pg-img-ready');
            return;
        }
        // When the *final* src finishes loading, mark ready
        const onLoad = () => {
            if (imgEl.src === fullUrl) {
                imgEl.classList.add('pg-img-ready');
                imgEl.removeEventListener('load', onLoad);
            }
        };
        imgEl.addEventListener('load', onLoad);

        // Swap to full
        imgEl.src = fullUrl;

        // If it was cached and load won't fire (edge case), mark ready anyway
        if (imgEl.complete && imgEl.naturalWidth > 0) {
            imgEl.classList.add('pg-img-ready');
            imgEl.removeEventListener('load', onLoad);
        }
    }


    function updateModalImage() {
        const item = ITEMS[currentIndex];
        const full = getSrc(item);
        const blur = (typeof item === 'object' && item.blurData) ? item.blurData : null;

        // start with blur (or blank) then swap to full
        modalImg.classList.remove('pg-img-ready');
        modalImg.src = blur || '';        // show blur quickly (or blank if none)
        modalImg.alt = getAlt(item, currentIndex);

        const big = new Image();
        big.src = full;
        big.decode?.().catch(() => {
        })
            .finally(() => {
                modalImg.src = full;
                modalImg.classList.add('pg-img-ready');
            });
    }

    function openModal(i) {
        if (!ITEMS.length) return;
        currentIndex = normalize(i);
        updateModalImage();
        setActiveThumb();
        ensureThumbVisible();
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        nextBtn.focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    function next() {
        currentIndex = normalize(currentIndex + 1);
        updateModalImage();
        setActiveThumb();
        ensureThumbVisible();
    }

    function prev() {
        currentIndex = normalize(currentIndex - 1);
        updateModalImage();
        setActiveThumb();
        ensureThumbVisible();
    }

    // build thumbs once (or rebuild on setImages)
    function renderThumbs() {
        thumbsEl.innerHTML = '';
        ITEMS.forEach((it, i) => {
            const b = document.createElement('button');
            b.className = 'pg-thumb';
            b.dataset.i = i;
            const t = document.createElement('img');
            t.src = getSrc(it);
            t.alt = getAlt(it, i);
            b.appendChild(t);
            b.addEventListener('click', () => {
                currentIndex = i;
                updateModalImage();
                setActiveThumb();
            });
            thumbsEl.appendChild(b);
        });
    }

    function preSpanByRatio(fig, ratio /* h/w */) {
        const rowH  = parseFloat(getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        const gap   = parseFloat(getComputedStyle(grid).getPropertyValue('gap'));
        const wpx   = fig.getBoundingClientRect().width;           // column width now
        const label = 28;                                          // small reserve for caption
        const hpx   = wpx * ratio + label;                         // predicted tile height
        const span  = Math.ceil((hpx + gap) / (rowH + gap));
        fig.style.gridRowEnd = `span ${span}`;
    }

    function renderGrid(append = false, startIndex = 0) {
        if (!append) grid.innerHTML = '';
        ITEMS.slice(startIndex).forEach((it, idx) => {
            const i = startIndex + idx;
            const fig = document.createElement('figure');
            fig.className = 'pg-card';
            fig.tabIndex = 0;
            fig.dataset.i = i;

            const img = document.createElement('img');
            img.loading = 'lazy';

            const w = it.w ?? it.width  ?? null;
            const h = it.h ?? it.height ?? null;
            const ratio = (w && h) ? (h / w) : null;

            // Reserve space *now*
            if (ratio) {
                fig.style.aspectRatio = `${w} / ${h}`; // prevents CLS at container level
                img.width  = w;                         // helps browsers reserve space
                img.height = h;
            }

            img.src = (typeof it === 'object' && it.blurData) ? it.blurData : getSrc(it);
            img.dataset.fullSrc = getSrc(it);
            img.alt = getAlt(it, i);

            const cap = document.createElement('figcaption');
            cap.className = 'pg-label';
            cap.textContent = (typeof it === 'object' && it.alt) ? it.alt : '';

            fig.appendChild(img);
            fig.appendChild(cap);
            grid.appendChild(fig);

            // Compute a preliminary span immediately using the ratio
            if (ratio) {
                requestAnimationFrame(() => preSpanByRatio(fig, ratio));
            }

            // Existing load handler can refine the span after the full image appears
            img.addEventListener('load', () => {
                // If you keep your existing resizeGridItem, it will fine‑tune the span.
                resizeGridItem(fig);
            });

            // Ensure blur -> full swap still happens (from earlier step)
            requestAnimationFrame(() => ensureFullImage(img));
        });

        requestAnimationFrame(resizeAll);
    }


    // events
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.pg-card');
        if (!card) return;
        openModal(parseInt(card.dataset.i, 10));
    });
    grid.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const card = e.target.closest('.pg-card');
            if (card) openModal(parseInt(card.dataset.i, 10));
        }
    });
    modal.addEventListener('click', (e) => {
        const inMain = e.target.closest('.pg-main') || e.target.closest('.pg-strip');
        if (!inMain) closeModal();
    });
    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
    });
    // simple touch swipe
    let touchStartX = null;
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, {passive: true});
    modal.addEventListener('touchend', (e) => {
        if (touchStartX == null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
        touchStartX = null;
    }, {passive: true});

    // public API
    function setImages(arr) {
        ITEMS = Array.isArray(arr) ? arr.slice() : [];
        renderGrid(false, 0);
        renderThumbs();
    }

    function addImages(arr) {
        const start = ITEMS.length;
        ITEMS = ITEMS.concat(arr || []);
        renderGrid(true, start);
        renderThumbs();
    }

    async function loadFrom(url, {map} = {}) {
        const res = await fetch(url);
        const data = await res.json();
        const normalized = map ? data.map(map) : data;
        setImages(normalized);
        return normalized;
    }

    function open(i = 0) {
        openModal(i);
    }

    function destroy() {
        window.removeEventListener('resize', resizeAll);
        container.innerHTML = '';
    }

    // init with provided images (if any)
    if (images && images.length) setImages(images);

    return {setImages, addImages, loadFrom, open, destroy, el: {grid, modal}};
}