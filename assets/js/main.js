/* ==========================================================================
   Sewa Mobil Murah Lampung — main.js
   Tanpa dependency. File ini opsional: semua tautan telepon dan WhatsApp
   sudah bekerja tanpa JavaScript, script ini hanya menambah Kenyamanan.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Header bayangan saat scroll ------------------------------------- */

  var header = document.querySelector('.header');

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --- Menu navigasi mobile ------------------------------------------- */

  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';

      navToggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        navToggle.focus();
      }
    });
  }

  /* --- Penyaring armada ----------------------------------------------- */

  var filterBar = document.querySelector('[data-filter-bar]');

  if (filterBar) {
    var buttons = filterBar.querySelectorAll('button[data-filter]');
    var brandSelect = document.querySelector('[data-filter-merk]');
    var cards = document.querySelectorAll('[data-kategori]');
    var brandGroups = document.querySelectorAll('[data-merk-group]');
    var counter = document.querySelector('[data-filter-count]');
    var emptyState = document.querySelector('[data-filter-empty]');
    var searchInput = document.querySelector('[data-filter-cari]');
    var pesanKosong = emptyState ? emptyState.textContent : '';

    var state = { kategori: 'semua', merk: 'semua', cari: '' };

    var applyFilter = function () {
      var shown = 0;
      var cari = state.cari.toLowerCase();

      buttons.forEach(function (button) {
        var active = button.getAttribute('data-filter') === state.kategori;
        button.setAttribute('aria-pressed', String(active));
      });

      cards.forEach(function (card) {
        var cocokKategori =
          state.kategori === 'semua' || card.getAttribute('data-kategori') === state.kategori;
        var cocokMerk = state.merk === 'semua' || card.getAttribute('data-merk') === state.merk;
        var cocokCari = true;

        if (cari) {
          var nama = card.querySelector('.car__name');
          var series = card.querySelector('.car__series');
          var teks =
            ((nama ? nama.textContent : '') + ' ' + (series ? series.textContent : '')).toLowerCase();
          cocokCari = teks.indexOf(cari) !== -1;
        }

        var match = cocokKategori && cocokMerk && cocokCari;
        card.hidden = !match;
        if (match) { shown += 1; }
      });

      brandGroups.forEach(function (group) {
        var ada = group.querySelectorAll('[data-kategori]:not([hidden])').length > 0;
        group.hidden = !ada;
      });

      if (counter) {
        if (state.cari && shown === 0) {
          counter.textContent = 'Tidak ada unit yang cocok dengan "' + state.cari + '".';
        } else if (state.cari) {
          counter.textContent =
            'Menampilkan ' + shown + ' dari ' + cards.length + ' unit untuk "' + state.cari + '".';
        } else if (shown === cards.length) {
          counter.textContent =
            'Menampilkan ' + shown + ' tipe unit dari merek yang lazim disewa di Indonesia.';
        } else {
          counter.textContent = 'Menampilkan ' + shown + ' dari ' + cards.length + ' tipe unit.';
        }
      }

      if (emptyState) {
        emptyState.hidden = shown !== 0;
        emptyState.textContent = state.cari
          ? 'Unit yang dicari tidak ada di katalog. Chat WhatsApp saja, biasanya kami punya alternatif yang cocok.'
          : pesanKosong;
      }
    };

    filterBar.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-filter]');
      if (button) {
        state.kategori = button.getAttribute('data-filter');
        applyFilter();
      }
    });

    if (brandSelect) {
      brandSelect.addEventListener('change', function () {
        state.merk = brandSelect.value;
        applyFilter();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () {
        state.cari = searchInput.value.trim();
        applyFilter();
      });
    }

    applyFilter();
  }

  /* --- Form pemesanan & kontak -> WhatsApp ----------------------------- */

  var waNumber = document.body.getAttribute('data-wa') || '';

  var formatTanggal = function (value) {
    if (!value) { return ''; }
    var parts = value.split('-');
    if (parts.length !== 3) { return value; }
    return parts[2] + '/' + parts[1] + '/' + parts[0];
  };

  document.querySelectorAll('form[data-wa-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = new FormData(form);
      var lines = [];

      if (data.get('nama')) {
        lines.push('Nama: ' + data.get('nama'));
      }

      if (data.get('telepon')) {
        lines.push('No. WhatsApp: ' + data.get('telepon'));
      }

      if (data.get('mulai')) {
        lines.push('Tanggal mulai: ' + formatTanggal(data.get('mulai')));
      }

      if (data.get('selesai')) {
        lines.push('Tanggal selesai: ' + formatTanggal(data.get('selesai')));
      }

      if (data.get('sopir')) {
        lines.push('Skema sewa: ' + data.get('sopir'));
      }

      if (data.get('area')) {
        lines.push('Area pemakaian: ' + data.get('area'));
      }

      if (data.get('mobil')) {
        lines.push('Unit yang diminta: ' + data.get('mobil'));
      }

      if (data.get('jam')) {
        lines.push('Jam ambil: ' + data.get('jam'));
      }

      if (data.get('lokasi')) {
        lines.push('Lokasi: ' + data.get('lokasi'));
      }

      if (data.get('catatan')) {
        lines.push('Catatan: ' + data.get('catatan'));
      }

      var pesan =
        'Halo ' + (form.getAttribute('data-wa-form') || 'Sewa Mobil Murah Lampung') +
        ', saya mau tanya sewa mobil.\n\n' +
        lines.join('\n') +
        '\n\nMohon info harga dan ketersediaannya. Terima kasih.';

      var url = 'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(pesan);
      window.open(url, '_blank', 'noopener');
    });
  });

  /* --- Ulasan: carousel geser manual ------------------------------------ */

  (function () {
    var carousel = document.querySelector('[data-carousel]');
    if (!carousel) return;

    var track = carousel.querySelector('[data-carousel-track]');
    var nav = carousel.querySelector('[data-carousel-nav]');
    var prev = carousel.querySelector('[data-carousel-prev]');
    var next = carousel.querySelector('[data-carousel-next]');
    var dotsBox = carousel.querySelector('[data-carousel-dots]');
    var jumlah = track.children.length;

    function langkah() {
      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      return track.firstElementChild.getBoundingClientRect().width + gap;
    }

    function perLayar() {
      return Math.max(1, Math.round(track.clientWidth / langkah()));
    }

    function perHalaman() {
      return perLayar() * langkah();
    }

    function totalHalaman() {
      return Math.max(1, Math.ceil(jumlah / perLayar()));
    }

    function halamanAktif() {
      var i = Math.round(track.scrollLeft / perHalaman());
      return Math.min(Math.max(i, 0), totalHalaman() - 1);
    }

    function buatTitik() {
      var total = totalHalaman();
      dotsBox.textContent = '';
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel__dot';
        dot.dataset.halaman = String(i);
        dot.setAttribute('aria-label', 'Ulasan halaman ' + (i + 1) + ' dari ' + total);
        dotsBox.appendChild(dot);
      }
      perbarui();
    }

    function perbarui() {
      var aktif = halamanAktif();
      for (var i = 0; i < dotsBox.children.length; i++) {
        var dot = dotsBox.children[i];
        var on = i === aktif;
        dot.classList.toggle('is-active', on);
        if (on) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      }
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    }

    function keHalaman(i) {
      var target = Math.min(Math.max(i, 0), totalHalaman() - 1);
      track.scrollTo({ left: target * perHalaman(), behavior: 'smooth' });
    }

    prev.addEventListener('click', function () { keHalaman(halamanAktif() - 1); });
    next.addEventListener('click', function () { keHalaman(halamanAktif() + 1); });

    dotsBox.addEventListener('click', function (event) {
      var dot = event.target.closest ? event.target.closest('.carousel__dot') : null;
      if (dot) keHalaman(Number(dot.dataset.halaman));
    });

    track.addEventListener('scroll', perbarui, { passive: true });

    var jeda;
    window.addEventListener('resize', function () {
      clearTimeout(jeda);
      jeda = setTimeout(buatTitik, 150);
    });

    nav.hidden = false;
    buatTitik();
  })();

  /* --- Tahun footer ----------------------------------------------------- */

  document.querySelectorAll('[data-year]').forEach(function (element) {
    element.textContent = String(new Date().getFullYear());
  });
})();
