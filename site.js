(function () {
  var all = window.GALLERY || [];
  var cfg = window.SITE || {};
  var root = document.documentElement;
  var lb = document.getElementById("lightbox");
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  // --- artwork protection -------------------------------------------------
  // Images are painted as CSS backgrounds (no <img>), so the browser offers no
  // "Save image as". Right-click, drag and long-press are blocked on artwork.
  // A speed bump for casual copying, not a wall; the watermarks are the real
  // protection.
  function guard(el) {
    ["contextmenu", "dragstart", "selectstart", "copy"].forEach(function (ev) {
      el.addEventListener(ev, function (e) { e.preventDefault(); return false; });
    });
  }
  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "u") && lb && !lb.hidden) e.preventDefault();
  });

  // --- dark mode -----------------------------------------------------------
  var themeBtn = document.getElementById("theme");
  function paintTheme() {
    if (!themeBtn) return;
    var dark = root.getAttribute("data-theme") === "dark";
    themeBtn.querySelector(".theme-label").textContent = dark ? "Light" : "Dark";
    themeBtn.setAttribute("aria-pressed", dark ? "true" : "false");
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paintTheme();
    });
    paintTheme();
  }

  // --- commissions stamp (open / closed) -----------------------------------
  var stamp = document.getElementById("comm-stamp");
  if (stamp && cfg.commissions === "closed") {
    stamp.textContent = "Commissions closed";
    stamp.classList.add("closed");
  }

  // --- copy email button ---------------------------------------------------
  var copyBtn = document.getElementById("copy-email");
  if (copyBtn) {
    var done = document.getElementById("copy-done");
    var tip = copyBtn.querySelector(".copy-email-tip");
    var ctimer;
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var finish = function () {
        copyBtn.classList.add("copied");
        tip.textContent = "Copied!";
        done.hidden = false;
        clearTimeout(ctimer);
        ctimer = setTimeout(function () {
          copyBtn.classList.remove("copied");
          tip.textContent = "Click to copy email to clipboard";
          done.hidden = true;
        }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(finish, function () { window.location.href = "mailto:" + email; });
      } else {
        var ta = document.createElement("textarea");
        ta.value = email; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); finish(); } catch (e) { window.location.href = "mailto:" + email; }
        document.body.removeChild(ta);
      }
    });
  }


  // --- request form + mailing list ------------------------------------------
  // With an endpoint configured in gallery.js these submit silently; without
  // one they open the visitor's mail app with everything pre-filled.
  function mailto(subject, body) {
    window.location.href = "mailto:" + (cfg.email || "hello@duraan.art") +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function fields(form) {
    var out = {};
    Array.prototype.forEach.call(form.elements, function (el) { if (el.name && el.name !== "_gotcha") out[el.name] = el.value.trim(); });
    return out;
  }
  function invalid(form, status) {
    var bad = form.querySelector(":invalid");
    if (!bad) return false;
    status.className = "req-status"; status.textContent = "Fill in the highlighted field first.";
    bad.focus(); return true;
  }

  var req = document.getElementById("req-form");
  if (req) {
    var reqStatus = document.getElementById("req-status");
    req.addEventListener("submit", function (e) {
      e.preventDefault();
      if (req.querySelector('[name="_gotcha"]').value) return;
      if (invalid(req, reqStatus)) return;
      var f = fields(req);
      var btn = req.querySelector("button[type=submit]");
      if (cfg.formEndpoint) {
        btn.disabled = true; reqStatus.className = "req-status"; reqStatus.textContent = "Sending...";
        fetch(cfg.formEndpoint, { method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" }, body: JSON.stringify(f) })
          .then(function (r) { if (!r.ok) throw new Error(); reqStatus.className = "req-status ok"; reqStatus.textContent = "Sent. I'll reply within a few days."; req.reset(); })
          .catch(function () { reqStatus.textContent = "That didn't go through. Email hello@duraan.art instead."; })
          .then(function () { btn.disabled = false; });
      } else {
        var body = "Name: " + f.name + "\nEmail: " + f.email + "\nType: " + f.type + "\nSize or placement: " + f.size +
          "\nBudget: " + f.budget + "\nReferences: " + f.refs + "\n\n" + f.details;
        mailto("Commission request: " + f.type, body);
        reqStatus.className = "req-status ok"; reqStatus.textContent = "Opening your mail app with the request filled in.";
      }
    });
  }

  var join = document.getElementById("join-form");
  if (join) {
    var joinStatus = document.getElementById("join-status");
    join.addEventListener("submit", function (e) {
      e.preventDefault();
      if (invalid(join, joinStatus)) return;
      var email = join.elements.email.value.trim();
      if (cfg.newsletterAction) {
        var fd = new FormData(); fd.append("email", email);
        fetch(cfg.newsletterAction, { method: "POST", body: fd, mode: "no-cors" })
          .then(function () { joinStatus.className = "req-status ok"; joinStatus.textContent = "Check your inbox to confirm."; join.reset(); })
          .catch(function () { joinStatus.textContent = "That didn't go through. Email hello@duraan.art and I'll add you."; });
      } else {
        mailto("Add me to the mailing list", "Please add " + email + " to the duraan.art mailing list.");
        joinStatus.className = "req-status ok"; joinStatus.textContent = "Opening your mail app.";
      }
    });
  }

  // --- presenter mode shortcut ----------------------------------------------
  if (document.querySelector('main[data-page="home"]')) {
    document.addEventListener("keydown", function (e) {
      if ((e.key === "p" || e.key === "P") && !e.metaKey && !e.ctrlKey && !/input|textarea|select/i.test(document.activeElement.tagName)) window.location.href = "/show.html";
    });
  }

  // --- signature: draws itself on, then the Farsi reflection appears ---------
  var sigBox = document.getElementById("signature");
  if (sigBox) {
    var sig = sigBox.querySelector(".sig");
    var strokes = Array.prototype.slice.call(sig.querySelectorAll("path"));
    var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion || !strokes[0].getTotalLength) {
      sig.classList.add("drawn"); sigBox.classList.add("ready");
    } else {
      var lens = strokes.map(function (p) { return p.getTotalLength(); });
      var total = lens.reduce(function (a, b) { return a + b; }, 0);
      var span = 2.4, at = 0.25;
      strokes.forEach(function (p, i) {
        var dur = lens[i] / total * span;
        p.style.strokeDasharray = lens[i] + " " + lens[i];
        p.style.strokeDashoffset = lens[i];
        p.style.transition = "stroke-dashoffset " + dur.toFixed(2) + "s cubic-bezier(.3,0,.5,1) " + at.toFixed(2) + "s, fill-opacity 450ms ease " + (at + dur * 0.6).toFixed(2) + "s";
        at += dur * 0.92;
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          strokes.forEach(function (p) { p.style.strokeDashoffset = "0"; p.classList.add("inked"); });
          setTimeout(function () { sig.classList.add("drawn"); sigBox.classList.add("ready"); }, (at + 0.2) * 1000);
        });
      });
    }
  }

  // --- hero slideshow --------------------------------------------------------
  var showEl = document.getElementById("show");
  if (showEl) {
    var slides = all.filter(function (it) { return it.hero; });
    // the headliner always opens the show; the rest shuffle behind it
    var head = slides.filter(function (it) { return it.headliner; });
    var rest = slides.filter(function (it) { return !it.headliner; });
    for (var k = rest.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = rest[k]; rest[k] = rest[j]; rest[j] = t; }
    slides = head.concat(rest);

    var frame = document.getElementById("show-frame");
    var stage = document.getElementById("show-stage");
    var fit = showEl.classList.contains("show-fit") && stage;
    var sTitle = document.getElementById("show-title");
    var sCount = document.getElementById("show-count");
    var bar = document.getElementById("show-progress");
    var playBtn = document.getElementById("show-play");
    var idx = 0, timer = null, paused = false, seconds = (document.body.classList.contains("kiosk") && cfg.kioskSeconds) || cfg.heroSeconds || 6;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    slides.forEach(function (it, i) {
      var d = document.createElement("div");
      d.className = "slide" + (i === 0 ? " on" : "");
      d.setAttribute("role", "img"); d.setAttribute("aria-label", "Artwork " + (i + 1));
      d.style.backgroundImage = "url(/images/" + it.file + ")";
      frame.appendChild(d);
    });
    var nodes = frame.children;
    guard(showEl);

    // size the frame to the current piece: tall pieces stand tall, wide ones
    // go wide, and nothing gets letterboxed
    function fitFrame() {
      if (!fit) return;
      var it = slides[idx], r = (it.w && it.h) ? it.w / it.h : 4 / 3;
      var availW = showEl.clientWidth;
      var availH = Math.max(280, Math.min(window.innerHeight * 0.62, 820));
      var w = Math.min(availW, availH * r), h = w / r;
      stage.style.width = Math.round(w) + "px";
      frame.style.height = Math.round(h) + "px";
    }
    if (fit) { fitFrame(); window.addEventListener("resize", fitFrame); }
    function restartBar() {
      bar.style.transition = "none"; bar.style.width = "0%";
      void bar.offsetWidth;
      if (!paused && !reduce) { bar.style.transition = "width " + seconds + "s linear"; bar.style.width = "100%"; }
    }
    function goTo(n) {
      nodes[idx].classList.remove("on");
      idx = (n + slides.length) % slides.length;
      nodes[idx].classList.add("on");
      fitFrame();
      sTitle.textContent = "";
      sCount.textContent = (idx + 1) + " / " + slides.length;
      restartBar();
    }
    function tick() { clearTimeout(timer); if (!paused) timer = setTimeout(function () { goTo(idx + 1); tick(); }, seconds * 1000); }
    function setPaused(p) {
      paused = p;
      playBtn.innerHTML = p ? "&#9654;" : "&#10074;&#10074;";
      playBtn.setAttribute("aria-label", p ? "Play" : "Pause");
      playBtn.setAttribute("aria-pressed", p ? "true" : "false");
      restartBar(); tick();
    }
    document.getElementById("show-prev").addEventListener("click", function () { goTo(idx - 1); tick(); });
    document.getElementById("show-next").addEventListener("click", function () { goTo(idx + 1); tick(); });
    playBtn.addEventListener("click", function () { setPaused(!paused); });
    frame.addEventListener("click", function () { goTo(idx + 1); tick(); });
    showEl.addEventListener("mouseenter", function () { clearTimeout(timer); bar.style.transition = "none"; });
    showEl.addEventListener("mouseleave", function () { restartBar(); tick(); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) clearTimeout(timer); else { restartBar(); tick(); } });
    document.addEventListener("keydown", function (e) {
      if (lb && !lb.hidden) return;
      if (e.key === "ArrowLeft") { goTo(idx - 1); tick(); }
      if (e.key === "ArrowRight") { goTo(idx + 1); tick(); }
    });
    goTo(0); tick();
  }

  // --- gallery grid ----------------------------------------------------------
  var grid = document.getElementById("grid");
  if (!grid) return;
  var wantSet = grid.getAttribute("data-set");
  var items = wantSet ? all.filter(function (it) { return it.set === wantSet; }) : all;
  if (!items.length) {
    grid.innerHTML = '<div class="empty">New work going up soon.</div>';
    return;
  }

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var t = en.target;
        t.style.backgroundImage = "url(/images/" + t.getAttribute("data-file") + ")";
        io.unobserve(t);
      }
    });
  }, { rootMargin: "400px" }) : null;

  items.forEach(function (it, i) {
    var b = document.createElement("button");
    b.className = "piece" + (it.wide ? " wide" : "");
    b.type = "button";
    b.setAttribute("aria-label", "Open artwork " + (i + 1));
    b.innerHTML = '<span class="art" role="img" aria-label="Artwork ' + (i + 1) + '" data-file="' + it.file + '"></span>';
    var art = b.querySelector(".art");
    if (it.w && it.h) art.style.setProperty("--ar", it.w + " / " + it.h);
    if (io) io.observe(art); else art.style.backgroundImage = "url(/images/" + it.file + ")";
    guard(b);
    b.addEventListener("click", function () { openLb(i); });
    grid.appendChild(b);
  });

  // --- lightbox --------------------------------------------------------------
  var img = document.getElementById("lb-img");
  var cap = document.getElementById("lb-cap");
  var cur = 0;
  guard(lb);

  function showLb(i) {
    cur = (i + items.length) % items.length;
    img.style.backgroundImage = "url(/images/" + items[cur].file + ")";
    img.setAttribute("aria-label", "Artwork " + (cur + 1) + " of " + items.length);
    cap.textContent = (cur + 1) + " / " + items.length;
  }
  function openLb(i) { showLb(i); lb.hidden = false; document.body.style.overflow = "hidden"; document.getElementById("lb-close").focus(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; }

  document.getElementById("lb-close").addEventListener("click", closeLb);
  document.getElementById("lb-prev").addEventListener("click", function () { showLb(cur - 1); });
  document.getElementById("lb-next").addEventListener("click", function () { showLb(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") showLb(cur - 1);
    if (e.key === "ArrowRight") showLb(cur + 1);
  });
})();
