/* =====================================================================
   Awwwards transitions — Dra. Luiza Liana
   Section overlays · Photo Fan · Method geometry · Gallery parallax
   ===================================================================== */
(function () {
  'use strict';

  var doc = document;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---- 1. Build tx-reveal overlays ---- */
  var txCfg = [
    { sel: '.manifesto',   n: 5, cls: 'tx-strip'  },
    { sel: '.about',       n: 0 },
    { sel: '.method',      n: 0 },
    { sel: '.film',        n: 6, cls: 'tx-hstrip' },
    { sel: '.beforeafter', n: 2, cls: 'tx-door'   },
    { sel: '.results',     n: 0 },
    { sel: '.testi',       n: 0 },
    { sel: '.cta',         n: 0 },
  ];

  txCfg.forEach(function (c) {
    var sec = doc.querySelector(c.sel);
    if (!sec) return;
    var ov = doc.createElement('div');
    ov.className = 'tx-reveal';
    for (var i = 0; i < (c.n || 0); i++) {
      var ch = doc.createElement('div');
      ch.className = c.cls;
      ov.appendChild(ch);
    }
    sec.insertBefore(ov, sec.firstChild);
  });

  /* ---- 2. Sticky gallery Ken Burns IO ---- */
  (function () {
    var sgalIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('sgal-in'); sgalIO.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    [].slice.call(document.querySelectorAll('.sgal-col .sgal-figure')).forEach(function (fig) {
      sgalIO.observe(fig);
    });
  })();

  /* ---- 3. Method decorative geometry ---- */
  (function () {
    var m = doc.querySelector('.method');
    if (!m) return;
    var bg = doc.createElement('div');
    bg.className = 'method-bg';
    m.insertBefore(bg, m.firstChild);
    [1, 2, 3].forEach(function (n) {
      var ring = doc.createElement('div');
      ring.className = 'method-ring method-ring-' + n;
      m.insertBefore(ring, m.firstChild);
    });
    doc.querySelectorAll('.method .row').forEach(function (row) {
      var line = doc.createElement('span');
      line.className = 'acc-line';
      row.appendChild(line);
    });
  })();

  /* ---- 3. Section transition IntersectionObserver ---- */
  var txIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var sec = e.target;

      if (sec.classList.contains('about')) {
        sec.classList.add('tx-in');
      } else if (sec.classList.contains('beforeafter')) {
        sec.classList.add('tx-in');
        setTimeout(function () { sec.classList.add('ba-revealed'); }, 1450);
      } else {
        sec.classList.add('tx-in');
      }
      txIO.unobserve(sec);
    });
  }, { threshold: 0.13 });

  txCfg.forEach(function (c) {
    var sec = doc.querySelector(c.sel);
    if (sec) txIO.observe(sec);
  });

})();
