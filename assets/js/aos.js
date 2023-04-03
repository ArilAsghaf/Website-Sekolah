
// AOS PAGE BERANDA
const beritaBeranda = document.querySelectorAll('.berita-beranda-item');

beritaBeranda.forEach((berita, i) => {
    berita.dataset.aos = 'fade-up';
    berita.dataset.aosDelay = i * 100;
    berita.dataset.aosDuration = 500;
    berita.dataset.aosOffset = 200;
});

const ekstrakulButton = document.querySelectorAll('.ekstrakul-button');

ekstrakulButton.forEach((button, i) => {
    button.dataset.aos = 'flip-down';
    button.dataset.aosDelay = i * 100;
    button.dataset.aosDuration = 500;
    button.dataset.aosOffset = 100;
});

const prestasiBeranda = document.querySelectorAll('.prestasi-item');

prestasiBeranda.forEach((prestasi, i) => {
    prestasi.dataset.aos = 'fade-up';
    prestasi.dataset.aosDelay = i * 100;
    prestasi.dataset.aosDuration = 500;
    prestasi.dataset.aosOffset = 100;
});

// AOS PAGE
const pageItem = document.querySelectorAll('.page-item');

pageItem.forEach((page, i) => {
    page.dataset.aos = 'flip-down';
    page.dataset.aosDelay = i * 100;
    page.dataset.aosDuration = 1000;
    page.dataset.aosOffset = 100;
});

// AOS PAGE SAMBUTAN
const sambutan = document.querySelectorAll('.teks-sambutan');

sambutan.forEach((teks, i) => {
    teks.dataset.aos = 'fade-up';
    teks.dataset.aosDelay = i * 10;
    teks.dataset.aosDuration = 500;
    teks.dataset.aosOffset = 50;
});

// AOS PAGE VISI MISI
const visimisi = document.querySelectorAll('.teks-visimisi');

visimisi.forEach((teks, i) => {
    teks.dataset.aos = 'fade-up';
    teks.dataset.aosDelay = i * 50;
    teks.dataset.aosDuration = 300;
    teks.dataset.aosOffset = 10;
});

// AOS PAGE GALERI
const galeri = document.querySelectorAll('.galeri-item');

galeri.forEach((pict, i) => {
    pict.dataset.aos = 'flip-down';
    pict.dataset.aosDelay = i * 50;
    pict.dataset.aosDuration = 500;
    pict.dataset.aosOffset = 70;
});

// AOS PAGE BERITA SEKOLAH
const beritaSekolah = document.querySelectorAll('.berita_sekolah');

beritaSekolah.forEach((berita, i) => {
    berita.dataset.aos = 'fade-up';
    berita.dataset.aosDelay = i * 100;
    berita.dataset.aosDuration = 500;
    berita.dataset.aosOffset = 200;
});

// AOS PAGE INFO
const infoSekolah = document.querySelectorAll('.info-item');

infoSekolah.forEach((info, i) => {
    info.dataset.aos = 'fade-up';
    info.dataset.aosDelay = i * 100;
    info.dataset.aosDuration = 500;
    info.dataset.aosOffset = 200;
});

// AOS PAGE AGENDA
const agendaSekolah = document.querySelectorAll('.agenda-item');

agendaSekolah.forEach((agenda, i) => {
    agenda.dataset.aos = 'fade-up';
    agenda.dataset.aosDelay = i * 100;
    agenda.dataset.aosDuration = 500;
    agenda.dataset.aosOffset = 200;
});

// AOS KATEGORI
const search = document.querySelectorAll('.searchbox');

search.forEach((cari) => {
    cari.dataset.aos = 'fade-down';
    cari.dataset.aosDuration = 500;
    cari.dataset.aosOffset = 100;
});

const kategoriInfo = document.querySelectorAll('.kategori');

kategoriInfo.forEach((kategori) => {
    kategori.dataset.aos = 'fade-down';
    kategori.dataset.aosDuration = 500;
    kategori.dataset.aosOffset = 100;
});

// AOS PAGE EKSTRAKULIKULER
const ekstrakulikuler = document.querySelectorAll('.ekstra-item');

ekstrakulikuler.forEach((ekstra, i) => {
    ekstra.dataset.aos = 'fade-up';
    ekstra.dataset.aosDelay = i * 100;
    ekstra.dataset.aosDuration = 500;
    ekstra.dataset.aosOffset = 200;
});

// AOS PAGE EKSTRAKULIKULER
const prestasi = document.querySelectorAll('.pres-item');

prestasi.forEach((pres, i) => {
    pres.dataset.aos = 'fade-up';
    pres.dataset.aosDelay = i * 100;
    pres.dataset.aosDuration = 500;
    pres.dataset.aosOffset = 200;
});

// AOS PAGE SARANA PRASARANA
const saranaPrasarana = document.querySelectorAll('.sarpras-item');

saranaPrasarana.forEach((sarpras, i) => {
    sarpras.dataset.aos = 'flip-down';
    sarpras.dataset.aosDelay = i * 50;
    sarpras.dataset.aosDuration = 500;
    sarpras.dataset.aosOffset = 70;
});

// AOS PAGE KONTAK
const aosKontak = document.querySelectorAll('.kontak-aos');

aosKontak.forEach((kontaks, i) => {
    kontaks.dataset.aos = 'fade-up-left';
    kontaks.dataset.aosDelay = i * 100;
    kontaks.dataset.aosDuration = 500;
    kontaks.dataset.aosOffset = 50;
});


AOS.init({
    once: true,
});