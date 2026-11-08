(function () {
  var items = window.GALLERY || [];
  var grid = document.getElementById("grid");
  document.getElementById("year").textContent = new Date().getFullYear();

  if (!items.length) {
    grid.innerHTML = '<div class="empty">New work going up soon.</div>';
    return;
  }

  items.forEach(function (it, i) {
    var b = document.createElement("button");
    b.className = "piece" + (it.wide ? " wide" : "");
    b.type = "button";
    b.setAttribute("aria-label", "Open " + it.title);
    b.innerHTML =
      '<span class="num">' + String(i + 1).padStart(2, "0") + "</span>" +
      '<img src="images/' + it.file + '" alt="' + it.title + '" loading="lazy">' +
      '<span class="cap"><span>' + it.title + "</span><span>" + (it.medium || "") + "</span></span>";
    b.addEventListener("click", function () { open(i); });
    grid.appendChild(b);
  });

  var lb = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  var cap = document.getElementById("lb-cap");
  var cur = 0;

  function show(i) {
    cur = (i + items.length) % items.length;
    img.src = "images/" + items[cur].file;
    img.alt = items[cur].title;
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
