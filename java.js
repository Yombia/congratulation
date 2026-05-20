document.getElementById('btn-lanjut').addEventListener('click', () => {

    /* ── 1. Putar musik ── */
    const audio = document.getElementById('bg-music');
    if (audio) audio.play().catch(e => console.log("Audio diblokir:", e));

    /* ── 2. Sembunyikan tombol ── */
    const btnWrapper = document.getElementById('action-btn-wrapper');
    btnWrapper.style.opacity      = '0';
    btnWrapper.style.pointerEvents = 'none';

    /* ── 3. Kalkulasi transform-origin presisi ke kelopak .flower--1 ── */
    const flowersEl = document.querySelector('.flowers');
    const petalEl   = document.querySelector('.flower--1 .flower__leafs');

    // Posisi tengah kelopak dalam viewport (setelah semua transform aktif)
    const petalRect    = petalEl.getBoundingClientRect();
    const petalCenterX = petalRect.left + petalRect.width  / 2;
    const petalCenterY = petalRect.top  + petalRect.height / 2;

    // Titik "jangkar" elemen .flowers dalam viewport, SEBELUM transformnya sendiri.
    // .flowers: left:50% → x = vw/2 | bottom:12vh → y = vh - 12vh
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const elemOriginX = vw / 2;
    const elemOriginY = vh * 0.88;   // vh - 12vh

    // Skala aktif dari CSS custom property
    const cssScale = parseFloat(
        getComputedStyle(document.documentElement)
        .getPropertyValue('--flower-scale')
    ) || 1.1;

    // Konversi posisi kelopak dari viewport-space ke local-space elemen
    // (bagi dengan skala karena transform sudah teraplikasi)
    const localX = (petalCenterX - elemOriginX) / cssScale;
    const localY = (petalCenterY - elemOriginY) / cssScale;

    // Pasang transform-origin SEBELUM class push-through ditambahkan
    flowersEl.style.transformOrigin = `${localX}px ${localY}px`;

    /* ── 4. Aktifkan zoom ──
     *
     * double-rAF: frame pertama browser merekam transformOrigin yang baru,
     * frame kedua baru class ditambahkan sehingga CSS transition terpicu
     * dari state yang sudah benar — tidak ada lompatan posisi.
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flowersEl.classList.add('push-through');
        });
    });

    /* ── 5. Sinkronisasi timing ──
     *
     * t=0ms     → zoom mulai
     * t=1100ms  → kelopak sudah menutupi ±80% layar → fade out phase-1
     * t=1900ms  → sinkron dengan durasi transition 1.8s → tampilkan phase-2
     * t=2700ms  → mulai animasi ketik surat (800ms setelah phase-2 aktif)
     */
    setTimeout(() => {
        const phase1 = document.getElementById('phase-1');
        phase1.style.transition   = 'opacity 0.5s ease';
        phase1.style.opacity      = '0';
        phase1.style.pointerEvents = 'none';
    }, 1100);

    setTimeout(() => {
        document.getElementById('phase-1').style.display = 'none';

        const phase2 = document.getElementById('phase-2');
        phase2.classList.add('active');

        setTimeout(() => ketikSurat(), 800);
    }, 1900);
});