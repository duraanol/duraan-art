(function () {
  var items = window.GALLERY || [];

  // --- dark mode -----------------------------------------------------------
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme");
  function paintTheme() {
    var dark = root.getAttribute("data-theme") === "dark";
    if (!themeBtn) return;
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
  var grid = document.getElementById("grid");
  document.getElementById("year").textContent = new Date().getFullYear();

  // --- copy email button ---------------------------------------------------
  var copyBtn = document.getElementById("copy-email");
  if (copyBtn) {
    var done = document.getElementById("copy-done");
    var tip = copyBtn.querySelector(".copy-email-tip");
    var timer;
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      var finish = function () {
        copyBtn.classList.add("copied");
        tip.textContent = "Copied!";
        done.hidden = false;
        clearTimeout(timer);
        timer = setTimeout(function () {
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

  // --- artwork protection -------------------------------------------------
  // Images are painted as CSS backgrounds (no <img>), so the browser offers no
  // "Save image as". Right-click, drag and long-press are blocked on artwork.
  // This is a speed bump for casual copying, not a wall; the watermarks are
  // the real protection.
  function guard(el) {
    ["contextmenu", "dragstart", "selectstart", "copy"].forEach(function (ev) {
      el.addEventListener(ev, function (e) { e.preventDefault(); return false; });
    });
  }
  document.addEventListener("keydown", function (e) {
    var k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === "s" || k === "u") && !lb.hidden) e.preventDefault();
  });

  if (!items.length) {
    grid.innerHTML = '<div class="empty">New work going up soon.</div>';
    return;
  }

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        var t = en.target;
        t.style.backgroundImage = "url(images/" + t.getAttribute("data-file") + ")";
        io.unobserve(t);
      }
    });
  }, { rootMargin: "400px" }) : null;

  items.forEach(function (it, i) {
    var b = document.createElement("button");
    b.className = "piece" + (it.wide ? " wide" : "");
    b.type = "button";
    b.setAttribute("aria-label", "Open " + it.title);
    b.innerHTML =
      '<span class="art" role="img" aria-label="' + it.title + '" data-file="' + it.file + '"></span>' +
      '<span class="cap"><span>' + it.title + "</span><span>" + (it.medium || "") + "</span></span>";
    var art = b.querySelector(".art");
    if (io) io.observe(art); else art.style.backgroundImage = "url(images/" + it.file + ")";
    guard(b);
    b.addEventListener("click", function () { open(i); });
    grid.appendChild(b);
  });

  var lb = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  var cap = document.getElementById("lb-cap");
  var cur = 0;
  guard(lb);

  function show(i) {
    cur = (i + items.length) % items.length;
    img.style.backgroundImage = "url(images/" + items[cur].file + ")";
    img.setAttribute("aria-label", items[cur].title);
    cap.textContent = items[cur].title + (items[cur].medium ? ". " + items[cur].medium : "");
  }
  function open(i) { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; document.getElementById("lb-close").focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ""; }

  document.getElementById("lb-close").addEventListener("click", close);
  document.getElementById("lb-prev").addEventListener("click", function () { show(cur - 1); });
  document.getElementById("lb-next").addEventListener("click", function () { show(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });
})();
