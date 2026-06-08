/* =========================================================================
   Projeto 2 — Obsidian Atelier
   GSAP-driven animation system for Dra. Luiza Liana
   ========================================================================= */
(function () {
  "use strict";

  var doc = document, body = doc.body;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (gsap && ST) gsap.registerPlugin(ST);

  /* ── Year ──────────────────────────────────────────────────────────────── */
  var y = doc.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ── Preloader ──────────────────────────────────────────────────────────── */
  var pre = doc.getElementById("preloader2");
  function finishPre() {
    if (!pre) return;
    pre.classList.add("done");
    setTimeout(function () { if (pre && pre.parentNode) pre.parentNode.removeChild(pre); }, 1000);
  }
  if (pre) {
    if (sessionStorage.getItem("ll2_seen")) {
      pre.classList.add("done"); if (pre.parentNode) pre.parentNode.removeChild(pre);
    } else {
      sessionStorage.setItem("ll2_seen", "1");
      window.addEventListener("load", function () { setTimeout(finishPre, 1500); });
      setTimeout(finishPre, 3000);
    }
  }

  /* ── Nav scroll state — rAF-throttled for 120fps ───────────────────────── */
  var nav = doc.getElementById("nav2");
  var prog = doc.getElementById("progress2");
  var scrollTicking = false;
  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(function () {
        var sc = window.scrollY || window.pageYOffset;
        if (nav) nav.classList.toggle("scrolled", sc > 60);
        if (prog) {
          var h = doc.documentElement.scrollHeight - window.innerHeight;
          prog.style.transform = "scaleX(" + (h > 0 ? sc / h : 0) + ")";
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Mobile menu ────────────────────────────────────────────────────────── */
  var burger = doc.getElementById("burger2"), mm = doc.getElementById("mobileMenu2");
  if (burger && mm) {
    burger.addEventListener("click", function () { mm.classList.toggle("open"); });
    mm.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { mm.classList.remove("open"); }); });
  }

  /* ── Custom cursor ──────────────────────────────────────────────────────── */
  if (window.matchMedia("(pointer:fine)").matches && !prefersReduced) {
    body.classList.add("has-cursor");
    var cur = doc.getElementById("cursor2"), dot = doc.getElementById("cursorDot2"), clabel2 = doc.getElementById("clabel2");
    var mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, dx = mx, dy = my;
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; });
    (function loop() {
      cx += (mx - cx) * 0.14; cy += (my - cy) * 0.14;
      dx += (mx - dx) * 0.4;  dy += (my - dy) * 0.4;
      if (cur) cur.style.transform = "translate(" + cx + "px," + cy + "px)";
      if (dot) dot.style.transform = "translate(" + dx + "px," + dy + "px)";
      requestAnimationFrame(loop);
    })();
    function setHover(type, label) {
      if (!cur) return;
      cur.classList.toggle("is-hover", type === "link");
      cur.classList.toggle("is-media", type === "media");
      if (dot) dot.classList.toggle("hide", !!type);
      if (clabel2 && type === "media") clabel2.textContent = label || "VER";
    }
    doc.addEventListener("mouseover", function (e) {
      var t = e.target.closest ? e.target.closest("[data-cursor]") : null;
      if (t) setHover(t.getAttribute("data-cursor"), t.getAttribute("data-clabel"));
    });
    doc.addEventListener("mouseout", function (e) {
      var t = e.target.closest ? e.target.closest("[data-cursor]") : null;
      if (t && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest("[data-cursor]") === t)) setHover(null);
    });
  }

  /* ── Marquee ────────────────────────────────────────────────────────────── */
  var mt = doc.getElementById("marqueeTrack2");
  if (mt) { mt.innerHTML = mt.innerHTML + mt.innerHTML; }

  /* ── Split text helper ──────────────────────────────────────────────────── */
  function splitChars(el) {
    if (!el) return [];
    var text = el.textContent;
    el.innerHTML = "";
    var chars = [];
    text.split("").forEach(function (ch) {
      var outer = doc.createElement("span");
      outer.className = "char";
      outer.style.display = ch === " " ? "inline" : "inline-block";
      outer.style.overflow = "hidden";
      if (ch === " ") { outer.innerHTML = "&nbsp;"; }
      else {
        var inner = doc.createElement("span");
        inner.className = "char-inner";
        inner.style.display = "inline-block";
        inner.textContent = ch;
        outer.appendChild(inner);
      }
      el.appendChild(outer);
      if (ch !== " ") chars.push(inner);
    });
    return chars;
  }

  /* ── GSAP Animations ────────────────────────────────────────────────────── */
  if (gsap && !prefersReduced) {

    /* Hero h1 split reveal */
    var heroLines = [].slice.call(doc.querySelectorAll(".hero2-h1-line"));
    var heroDelay = sessionStorage.getItem("ll2_seen") ? 0.2 : 1.6;
    heroLines.forEach(function (line, li) {
      var chars = splitChars(line);
      gsap.from(chars, {
        yPercent: 105,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.03,
        delay: heroDelay + li * 0.18
      });
    });

    /* Hero supporting elements */
    gsap.to(".hero2-eyebrow", { opacity: 1, y: 0, duration: .9, ease: "power3.out", delay: heroDelay + 0.5 });
    gsap.from(".hero2-eyebrow", { y: 20, duration: .9, ease: "power3.out", delay: heroDelay + 0.5 });
    gsap.to(".hero2-sub .lead", { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: heroDelay + 0.9 });
    gsap.from(".hero2-sub .lead", { y: 30, duration: 1, ease: "power3.out", delay: heroDelay + 0.9 });
    gsap.to(".hero2-sub .hero2-actions", { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: heroDelay + 1.1 });
    gsap.from(".hero2-sub .hero2-actions", { y: 20, duration: 1, ease: "power3.out", delay: heroDelay + 1.1 });
    gsap.to(".hero2-tag", { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: heroDelay + 1.2 });
    gsap.from(".hero2-tag", { x: -20, duration: 1, ease: "power3.out", delay: heroDelay + 1.2 });
    gsap.to(".hero2-scroll", { opacity: 1, duration: 1, ease: "power2.out", delay: heroDelay + 1.6 });

    /* Portrait parallax — rAF-throttled, GPU-only transform */
    var portrait = doc.querySelector(".hero2-portrait");
    if (portrait) {
      portrait.style.willChange = "transform";
      var parTicking = false;
      window.addEventListener("scroll", function () {
        if (!parTicking) {
          requestAnimationFrame(function () {
            var sc = window.scrollY || window.pageYOffset;
            if (sc < window.innerHeight * 1.2) {
              portrait.style.transform = "translate3d(0," + (sc * 0.1) + "px,0)";
            }
            parTicking = false;
          });
          parTicking = true;
        }
      }, { passive: true });
    }

    /* Generic section reveals */
    [].slice.call(doc.querySelectorAll("[data-gsap-reveal]")).forEach(function (el) {
      var dir = el.getAttribute("data-gsap-reveal") || "up";
      var initVars = { autoAlpha: 0 };
      var fromVars = { autoAlpha: 0, duration: 1, ease: "power3.out" };
      if (dir === "up")    { initVars.y = 50;   fromVars.y = 50; }
      if (dir === "left")  { initVars.x = -60;  fromVars.x = -60; }
      if (dir === "right") { initVars.x = 60;   fromVars.x = 60; }
      if (dir === "scale") { initVars.scale = 0.92; fromVars.scale = 0.92; }
      gsap.set(el, initVars);
      gsap.to(el, Object.assign({ autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 1, ease: "power3.out" }, {
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      }));
    });

    /* Staggered card groups */
    [].slice.call(doc.querySelectorAll("[data-gsap-stagger]")).forEach(function (group) {
      var items = [].slice.call(group.children);
      gsap.set(items, { autoAlpha: 0, y: 40 });
      gsap.to(items, {
        autoAlpha: 1, y: 0, duration: .9, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: group, start: "top 82%", once: true }
      });
    });

    /* h2 displays: split line by line */
    [].slice.call(doc.querySelectorAll(".display[data-split]")).forEach(function (h) {
      var lines = [].slice.call(h.querySelectorAll(".ln"));
      if (!lines.length) {
        gsap.from(h, {
          opacity: 0, y: 40, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: h, start: "top 85%", once: true }
        });
        return;
      }
      lines.forEach(function (ln, i) {
        var inner = ln.querySelector("span");
        if (inner) {
          gsap.from(inner, {
            yPercent: 105, duration: 1.1, ease: "power4.out", delay: i * 0.12,
            scrollTrigger: { trigger: h, start: "top 85%", once: true }
          });
        }
      });
    });

    /* Stat counter animation */
    [].slice.call(doc.querySelectorAll(".stat-count")).forEach(function (el) {
      var target = parseInt(el.getAttribute("data-target"), 10) || 0;
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target,
        duration: 2, ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: { trigger: el, start: "top 80%", once: true }
      });
    });

    /* Horizontal gallery scroll */
    var galleryPin = doc.querySelector(".gallery2-pin");
    var galleryTrack = doc.querySelector(".gallery2-track");
    if (galleryPin && galleryTrack) {
      /* Wait a tick for layout to settle */
      requestAnimationFrame(function () {
        var totalWidth = galleryTrack.scrollWidth;
        var viewW = galleryPin.offsetWidth;
        var distance = totalWidth - viewW;
        if (distance > 0) {
          gsap.to(galleryTrack, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: galleryPin,
              start: "top top",
              end: "+=" + (distance + 100) + "px",
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true
            }
          });
        }
      });
    }

    /* ─────────────────────────────────────────────────────────────────────
       WEB ELEMENTS — Inspired by isantorsula.work
       ───────────────────────────────────────────────────────────────────── */

    /* 1 ── HERO PERSPECTIVE SCALE-OUT (ref: tile-intro collapse)
       As the user scrolls, hero compresses in perspective, giving depth.
       Uses scrub so it's directly tied to scroll position (smooth at 120fps).
    ─────────────────────────────────────────────────────────────────────── */
    var hero2el = doc.querySelector('.hero2');
    if (hero2el) {
      /* Scale-out: hero compresses as user scrolls into the site */
      gsap.to(hero2el, {
        scale: 0.88,
        borderRadius: '20px',
        ease: 'none',
        scrollTrigger: {
          trigger: hero2el,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.4,
          invalidateOnRefresh: true
        }
      });
      /* Darken the hero bg video overlay as it exits */
      var heroBg = hero2el.querySelector('.hero2-bg');
      if (heroBg) {
        gsap.to(heroBg, {
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: hero2el,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4
          }
        });
      }
    }

    /* 2 ── OVERTEXT HORIZONTAL PARALLAX BANDS (ref: giant fullscreen type)
       Each band drifts in opposite horizontal directions as user scrolls past it,
       creating counter-scroll movement that signals depth and intentionality.
    ─────────────────────────────────────────────────────────────────────── */
    [].slice.call(doc.querySelectorAll('.overtext2')).forEach(function (band, i) {
      var inner = band.querySelector('.ot-inner');
      if (!inner) return;
      var isRtl = band.classList.contains('overtext2--rtl');
      var sign  = isRtl ? 1 : -1; // ot1 drifts left→right, ot2 right→left
      gsap.fromTo(inner,
        { x: sign * -80 },
        {
          x: sign * 80,
          ease: 'none',
          scrollTrigger: {
            trigger: band,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
            invalidateOnRefresh: true
          }
        }
      );
    });

    /* 3 ── SECTION PERSPECTIVE SCALE ENTER (ref: framer-5dh3f6 entrance)
       Sections rise forward from scale(0.94) as they enter viewport,
       like "tiles" coming into focus from the background depth.
    ─────────────────────────────────────────────────────────────────────── */
    /* Section enters "forward" from depth — scale only, no opacity conflict with children */
    [].slice.call(doc.querySelectorAll('[data-scene-enter]')).forEach(function (section) {
      gsap.fromTo(section,
        { scale: 0.90, y: 80 },
        {
          scale: 1,
          y: 0,
          ease: 'power4.out',
          duration: 1.3,
          scrollTrigger: {
            trigger: section,
            start: 'top 92%',
            once: true,
            invalidateOnRefresh: true
          }
        }
      );
    });

    /* Dramatic line-rise on h2.display that don't already have data-gsap-reveal */
    [].slice.call(doc.querySelectorAll('h2.display:not([data-gsap-reveal])')).forEach(function (h) {
      gsap.fromTo(h,
        { yPercent: 50, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: { trigger: h, start: 'top 88%', once: true }
        }
      );
    });

    /* ── ZOOM PARALLAX ────────────────────────────────────────────────────────
       Port of zoom-parallax.tsx
       7 frames each scale at a different rate (data-zp-scale attr) via scrub.
       Outer .zp-outer fills the sticky viewport; GSAP scales it from 1 → N.
       Because it's centered, the offset inner images zoom toward their position.
    ─────────────────────────────────────────────────────────────────────────── */
    var zpSection = doc.querySelector('.zp-section');
    var zpOuters  = [].slice.call(doc.querySelectorAll('.zp-outer'));
    if (zpSection && zpOuters.length) {
      zpOuters.forEach(function (outer) {
        var targetScale = parseFloat(outer.getAttribute('data-zp-scale')) || 4;
        gsap.fromTo(outer,
          { scale: 1 },
          {
            scale: targetScale,
            ease: 'none',
            scrollTrigger: {
              trigger: zpSection,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,   /* native scrub = tightest possible 1:1 linkage */
              invalidateOnRefresh: true
            }
          }
        );
      });

      /* Fade out the scroll-cue label as user starts scrolling */
      var zpLabel = doc.querySelector('.zp-label');
      if (zpLabel) {
        gsap.to(zpLabel, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: zpSection,
            start: 'top top',
            end: '+=25%',
            scrub: true
          }
        });
      }
    }

    /* 4 ── CTA BACKGROUND TEXT: subtle upward parallax
       The giant "ESSÊNCIA" text drifts slightly upward as the CTA scrolls in.
    ─────────────────────────────────────────────────────────────────────── */
    var ctaBgText = doc.querySelector('.cta2-bg-text');
    if (ctaBgText) {
      gsap.fromTo(ctaBgText,
        { y: 40 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: '.cta2',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true
          }
        }
      );
    }

  } else {
    /* Fallback: everything already visible, just show hero elements */
    [].slice.call(doc.querySelectorAll(".hero2-eyebrow,.hero2-sub .lead,.hero2-sub .hero2-actions,.hero2-tag,.hero2-scroll")).forEach(function (el) {
      el.style.opacity = "1";
    });
  }

  /* ── Manifesto scroll-linked word fill ─────────────────────────────────── */
  var man = doc.querySelector("[data-manifesto2]");
  if (man) {
    var html = man.innerHTML;
    var tmp = doc.createElement("div"); tmp.innerHTML = html;
    function wrapWords(node) {
      [].slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = doc.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (/^\s+$/.test(part) || part === "") { frag.appendChild(doc.createTextNode(part)); }
            else { var s = doc.createElement("span"); s.className = "w"; s.textContent = part; frag.appendChild(s); }
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { wrapWords(n); }
      });
    }
    wrapWords(tmp); man.innerHTML = tmp.innerHTML;
    var words = [].slice.call(man.querySelectorAll(".w"));
    if (prefersReduced) { words.forEach(function (w) { w.style.opacity = 1; }); }
    else {
      /* fillWords — rAF-throttled to not block scroll thread */
      var fillTicking = false;
      function fillWords() {
        if (fillTicking) return;
        fillTicking = true;
        requestAnimationFrame(function () {
          var rect = man.getBoundingClientRect(), vh = window.innerHeight;
          var p = (vh - rect.top) / (vh * 0.7 + rect.height);
          p = Math.max(0, Math.min(1, p));
          var lit = Math.round(p * words.length);
          words.forEach(function (w, i) { w.style.opacity = i < lit ? 1 : 0.12; });
          fillTicking = false;
        });
      }
      window.addEventListener("scroll", fillWords, { passive: true });
      window.addEventListener("resize", fillWords); fillWords();
    }
  }

  /* ── Method accordion with image swap ─────────────────────────────────── */
  [].slice.call(doc.querySelectorAll(".method2-item")).forEach(function (item) {
    var row = item.querySelector(".method2-row");
    if (!row) return;
    var detail = item.querySelector(".method2-detail");
    var imgKey = item.getAttribute("data-method-img");

    row.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close all
      [].slice.call(doc.querySelectorAll(".method2-item")).forEach(function (i) {
        i.classList.remove("open");
        var d = i.querySelector(".method2-detail");
        if (d) d.classList.remove("open");
      });
      [].slice.call(doc.querySelectorAll(".method2-img")).forEach(function (img) {
        img.classList.remove("active");
      });
      if (!isOpen) {
        item.classList.add("open");
        if (detail) detail.classList.add("open");
        // swap bg image
        if (imgKey) {
          var target = doc.querySelector('.method2-img[data-key="' + imgKey + '"]');
          if (target) target.classList.add("active");
        }
      }
    });
  });
  // activate first method item by default
  var firstMethod = doc.querySelector(".method2-item");
  if (firstMethod) {
    var firstDetail = firstMethod.querySelector(".method2-detail");
    firstMethod.classList.add("open");
    if (firstDetail) firstDetail.classList.add("open");
    var firstImg = doc.querySelector(".method2-img");
    if (firstImg) firstImg.classList.add("active");
  }

  /* ── Film video (bastidores) ───────────────────────────────────────────── */
  (function () {
    var wrap = doc.querySelector(".film2-wrap"), btn = doc.getElementById("filmPlay2"), vid = doc.getElementById("filmVideo2");
    if (!wrap || !btn || !vid) return;
    btn.addEventListener("click", function () {
      if (vid.muted) { vid.muted = false; vid.currentTime = 0; vid.play(); wrap.classList.add("playing"); }
      else { vid.muted = true; wrap.classList.remove("playing"); }
    });
  })();

  /* ── Lazy autoplay for film video ─────────────────────────────────────── */
  (function () {
    var lazyV = doc.getElementById("filmVideo2");
    if (!lazyV || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { lazyV.play().catch(function(){}); io.unobserve(lazyV); }
      });
    }, { threshold: 0.3 });
    io.observe(lazyV);
  })();

  /* ── Testimonial video players ─────────────────────────────────────────── */
  ["1","2","3"].forEach(function (n) {
    var btn = doc.getElementById("tplay2-" + n);
    var vid = doc.getElementById("testiVid2-" + n);
    if (!btn || !vid) return;
    var wrap2 = vid.closest ? vid.closest(".tv2wrap") : vid.parentNode;
    function toggle() {
      if (vid.paused) {
        vid.muted = false; vid.play().catch(function(){});
        if (wrap2) wrap2.classList.add("playing");
      } else { vid.pause(); }
    }
    btn.addEventListener("click", toggle);
    vid.addEventListener("click", toggle);
    vid.addEventListener("pause",  function () { if (wrap2) wrap2.classList.remove("playing"); });
    vid.addEventListener("ended",  function () { if (wrap2) wrap2.classList.remove("playing"); });
  });

  /* ── Auto-pause videos on scroll-out ───────────────────────────────────── */
  (function () {
    if (!("IntersectionObserver" in window)) return;
    var allVids = [].slice.call(doc.querySelectorAll("video"));
    var pauseIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (!e.isIntersecting && !e.target.muted) e.target.pause(); });
    }, { threshold: 0.15 });
    allVids.forEach(function (v) { pauseIO.observe(v); });
  })();

  /* ── Testimonials float animation trigger ─────────────────────────────── */
  (function () {
    if (!("IntersectionObserver" in window)) return;
    var testi = doc.querySelector(".testi2");
    if (!testi) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { testi.classList.add("testi-in"); io.unobserve(testi); }
      });
    }, { threshold: 0.2 });
    io.observe(testi);
  })();

  /* ── Before / After slider ─────────────────────────────────────────────── */
  (function () {
    var ba = doc.getElementById("ba2"), clip = doc.getElementById("afterClip2"), handle = doc.getElementById("baHandle2");
    if (!ba || !clip || !handle) return;
    var dragging = false;
    function setPos(clientX) {
      var r = ba.getBoundingClientRect();
      var x = Math.max(0, Math.min(r.width, clientX - r.left));
      var pct = (x / r.width) * 100;
      clip.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      handle.style.left = pct + "%";
    }
    function down(e) { dragging = true; setPos((e.touches ? e.touches[0] : e).clientX); }
    function move(e) { if (!dragging) return; setPos((e.touches ? e.touches[0] : e).clientX); }
    function up() { dragging = false; }
    handle.addEventListener("mousedown", down); ba.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    ba.addEventListener("touchstart", down, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", up);
  })();

  /* ── Anchor nav: bypass ScrollTrigger pin offsets ──────────────────────── */
  [].slice.call(doc.querySelectorAll('a[href^="#"]')).forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = doc.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  /* ── ScrollTrigger refresh on resize ───────────────────────────────────── */
  if (ST) {
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { ST.refresh(); }, 200);
    });
  }

  /* ── FAQ accordion ─────────────────────────────────────────────────────── */
  [].slice.call(doc.querySelectorAll(".faq2-q")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq2-item");
      var ans = item && item.querySelector(".faq2-a");
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      // close all
      [].slice.call(doc.querySelectorAll(".faq2-q")).forEach(function (b) { b.setAttribute("aria-expanded","false"); });
      [].slice.call(doc.querySelectorAll(".faq2-a")).forEach(function (a) { a.classList.remove("open"); });
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        if (ans) ans.classList.add("open");
      }
    });
  });

  /* ── Lightbox ──────────────────────────────────────────────────────────── */
  (function () {
    var lb = doc.querySelector(".lightbox2");
    var lbImg = lb && lb.querySelector("img");
    if (!lb || !lbImg) return;
    lb.addEventListener("click", function () { lb.classList.remove("open"); });
    [].slice.call(doc.querySelectorAll(".gallery2-slide")).forEach(function (slide) {
      var img = slide.querySelector("img");
      if (!img) return;
      slide.addEventListener("click", function () {
        lbImg.src = img.src;
        lb.classList.add("open");
      });
    });
  })();

  /* ── Marquee speed — fixed, sem variação por scroll ────────────────────── */
  /* velocity-based speed desativada — animação CSS pura em 32s constante */

  /* ── Interactive Selector ─────────────────────────────────────────────────
     Port of interactive-selector.tsx
     Horizontal expandable panels — click to expand, flex ratio 1→7.
     Stagger-in animation on section enter (replicates React useEffect timers).
  ─────────────────────────────────────────────────────────────────────────── */
  (function () {
    var items = [].slice.call(doc.querySelectorAll('.iselector-item'));
    if (!items.length) return;

    /* Click: deactivate all, activate clicked */
    function activateItem(idx) {
      items.forEach(function (el) { el.classList.remove('active'); });
      items[idx].classList.add('active');
    }
    items.forEach(function (item, i) {
      item.addEventListener('click', function () { activateItem(i); });
    });

    /* Stagger-in on enter — mirrors React useEffect with 180ms * i timers */
    var revealed = false;
    function revealItems() {
      if (revealed) return;
      revealed = true;
      items.forEach(function (item, i) {
        setTimeout(function () {
          item.classList.add('is-revealed');
        }, 180 * i);
      });
    }

    /* Trigger stagger when section enters viewport */
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          revealItems();
          io.disconnect();
        }
      }, { threshold: 0.15 });
      var iselSection = doc.getElementById('tratamentos');
      if (iselSection) io.observe(iselSection);
    } else {
      revealItems(); /* fallback: reveal immediately */
    }
  })();

  /* ── 3D Perspective tilt (ref: 3D floating cards, isantorsula.work) ────── */
  if (window.matchMedia('(pointer:fine)').matches && !prefersReduced) {
    function addTilt(selector, maxRot) {
      maxRot = maxRot || 8;
      [].slice.call(doc.querySelectorAll(selector)).forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          el.style.transition = 'transform 0.12s linear';
        });
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var nx = (e.clientX - r.left) / r.width  - 0.5; // -0.5 to 0.5
          var ny = (e.clientY - r.top)  / r.height - 0.5;
          el.style.transition = '';
          el.style.transform = 'perspective(900px) rotateX(' + (-ny * maxRot) + 'deg) rotateY(' + (nx * maxRot) + 'deg) scale3d(1.02,1.02,1.02) translateZ(0)';
        });
        el.addEventListener('mouseleave', function () {
          el.style.transition = 'transform 0.65s cubic-bezier(0.16,1,0.3,1)';
          el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
          setTimeout(function () { el.style.transform = ''; el.style.transition = ''; }, 650);
        });
      });
    }
    addTilt('.method2-item', 5);
    addTilt('.stat-item', 9);
    addTilt('.quote2', 4);
  }

  /* ── Testimonial video cards — GSAP continuous float (ref: 3D depth cards) */
  if (window.gsap && !prefersReduced) {
    [].slice.call(doc.querySelectorAll('.tvcard2[data-float]')).forEach(function (card) {
      var idx = parseInt(card.getAttribute('data-float'), 10) || 0;
      window.gsap.to(card, {
        y: -12 + (idx * 3),
        duration: 2.6 + idx * 0.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: idx * 0.5
      });
    });
  }

  /* ── Magnetic buttons ──────────────────────────────────────────────────── */
  if (window.matchMedia("(pointer:fine)").matches && !prefersReduced) {
    [].slice.call(doc.querySelectorAll(".btn--accent, .btn--ghost")).forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx2 = e.clientX - (r.left + r.width  / 2);
        var my2 = e.clientY - (r.top  + r.height / 2);
        btn.style.transform = "translate(" + mx2 * 0.18 + "px," + my2 * 0.22 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
        btn.style.transition = "transform .4s cubic-bezier(0.16,1,0.3,1)";
        setTimeout(function () { btn.style.transition = ""; }, 400);
      });
    });
  }

})();
