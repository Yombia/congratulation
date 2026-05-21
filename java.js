window.onload = () => {
    const c = setTimeout(() => {
        document.body.classList.remove("not-loaded");
        clearTimeout(c);
    }, 1000);
};

const pesanAfirmasi = "Selamat atas wisudanya, Marsela. Kamu luar biasa, dan aku sangat bangga bisa melihat kamu berdiri di titik ini sekarang. Semangat terus ya untuk perjalanan barumu. Jangan lupa luangkan waktu untuk mengapresiasi dirimu sendiri atas segala lelah yang berhasil kamu taklukkan. Aku yakin, ini baru gerbang pembuka untuk hal-hal hebat lainnya. Tuhan Yesus memberkati langkahmu selalu. Take care.";

let indexHuruf = 0;
const kecepatanKetik = 60; 

function ketikSurat() {
    if (indexHuruf < pesanAfirmasi.length) {
        document.getElementById("text-container").innerHTML += pesanAfirmasi.charAt(indexHuruf);
        indexHuruf++;
        setTimeout(ketikSurat, kecepatanKetik);
    } else {
        document.querySelector('.cursor').style.display = 'none';
    }
}

document.getElementById('btn-lanjut').addEventListener('click', () => {

    /* ── 1. Putar musik ── */
    const audio = document.getElementById('bg-music');
    if (audio) audio.play().catch(e => console.log("Audio diblokir:", e));

    /* ── 2. Sembunyikan tombol ── */
    const btnWrapper = document.getElementById('action-btn-wrapper');
    btnWrapper.style.opacity       = '0';
    btnWrapper.style.pointerEvents = 'none';

    /* ── 3. Kalkulasi transform-origin presisi ke kelopak .flower--1 ── */
    const flowersEl = document.querySelector('.flowers');
    const petalEl   = document.querySelector('.flower--1 .flower__leafs');

    // Posisi tengah kelopak dalam viewport (setelah semua transform aktif)
    const petalRect    = petalEl.getBoundingClientRect();
    const petalCenterX = petalRect.left + petalRect.width  / 2;
    const petalCenterY = petalRect.top  + petalRect.height / 2;

    // Titik "jangkar" elemen .flowers dalam viewport, SEBELUM transformnya sendiri.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const elemOriginX = vw / 2;
    const elemOriginY = vh * 0.88;   // vh - 12vh

    // Skala aktif dari CSS custom property
    const cssScale = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--flower-scale')
    ) || 1.1;

    // Konversi posisi kelopak dari viewport-space ke local-space elemen
    const localX = (petalCenterX - elemOriginX) / cssScale;
    const localY = (petalCenterY - elemOriginY) / cssScale;

    /* ── 4. KUNCI KOORDINAT & STATE 1 (PRE-ZOOM) ──
       Eksekusi sinkronus: Membunuh elemen bayangan dan tangkai bunga
       SEKETIKA sebelum browser sempat memikirkan frame animasi. */
    flowersEl.style.transformOrigin = `${localX}px ${localY}px`;
    flowersEl.classList.add('pre-zoom');

    /* ── 5. STATE 2 (PUSH-THROUGH ZOOM) ──
     * double-rAF: frame pertama browser merekam GPU clean-up dan origin,
     * frame kedua meledakkan scale(40) dengan ringan.
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            flowersEl.classList.add('push-through');
        });
    });

    /* ── 6. Sinkronisasi timing ke Phase 2 ── */
    setTimeout(() => {
        const phase1 = document.getElementById('phase-1');
        phase1.style.transition   = 'opacity 0.5s ease';
        phase1.style.opacity      = '0';
        phase1.style.pointerEvents = 'none';
    }, 1000); // Memudar pas saat layar memerah

    setTimeout(() => {
        document.getElementById('phase-1').style.display = 'none';

        const phase2 = document.getElementById('phase-2');
        phase2.classList.add('active');

        setTimeout(() => ketikSurat(), 800);
    }, 1700); // 1.7 detik adalah sweet spot untuk kelonggaran transisi
});