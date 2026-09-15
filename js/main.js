// Moving to London UK — shared site behavior

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
      var expanded = links.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  // Lead capture forms (checklist signup, contact) are wired for Netlify
  // Forms — see README.md. Submits via AJAX so the page doesn't reload;
  // falls back to a normal POST if the fetch fails (e.g. not yet hosted
  // on Netlify, or opened locally via file://).
  var forms = document.querySelectorAll('form[data-netlify="true"]');
  forms.forEach(function (form) {
    function handleSubmit(e) {
      e.preventDefault();

      var data = new URLSearchParams(new FormData(form)).toString();

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data
      })
        .then(function () {
          var note = form.querySelector(".form-success");
          if (note) note.style.display = "block";
          var downloadLink = form.querySelector(".form-download-link");
          if (downloadLink) downloadLink.style.display = "inline-block";
          form.reset();
        })
        .catch(function () {
          // Fetch failed (likely not deployed on Netlify yet) — submit normally.
          form.removeEventListener("submit", handleSubmit);
          form.submit();
        });
    }
    form.addEventListener("submit", handleSubmit);
  });
});

// Homepage area explorer map — all 15 neighbourhoods plotted along a
// real-geometry Thames trace, each linking to its own live guide.
document.addEventListener("DOMContentLoaded", function () {
  var svg = document.getElementById("geoMap");
  if (!svg) return;

  var mpTag = document.getElementById("mpTag");
  var mpTitle = document.getElementById("mpTitle");
  var mpHook = document.getElementById("mpHook");
  var mpLink = document.getElementById("mpLink");
  var NS = "http://www.w3.org/2000/svg";

  var NEIGHBOURHOODS = [
    { name: "Hampstead", tag: "North London", hook: "A heath the size of a small town and a village centre that barely feels like London at all.", x: 236.7, y: 35, side: "right", href: "neighborhoods/hampstead.html", available: true },
    { name: "Islington", tag: "North London", hook: "Georgian terraces and a genuinely walkable high street, ten minutes from the City.", x: 345.6, y: 89.1, side: "left", href: "neighborhoods/islington.html", available: true },
    { name: "Marylebone", tag: "Central London", hook: "Village shops, garden squares, and the easiest central postcode to actually feel settled in.", x: 276.9, y: 176.7, side: "left", href: "neighborhoods/marylebone.html", available: true },
    { name: "Notting Hill", tag: "West London", hook: "Colourful terraces and a Saturday market that's still a real neighbourhood, not just a postcard.", x: 209.8, y: 211.6, side: "right", href: "neighborhoods/notting-hill.html", available: true },
    { name: "South Kensington", tag: "West London", hook: "The Lycée, the museums, and the closest thing London has to a French quarter.", x: 222.7, y: 262.6, side: "right", href: "neighborhoods/south-kensington.html", available: true },
    { name: "Chelsea", tag: "West London", hook: "The most established expat postcode in the city, and priced like it — north bank, facing Battersea across the water.", x: 245.8, y: 281.1, side: "right", href: "neighborhoods/chelsea.html", available: true },
    { name: "Richmond", tag: "West London", hook: "Green space, riverside living, and a quieter pace close to the city, right where the river loops north around Kew before winding on toward Hammersmith.", x: 69.5, y: 377.2, side: "right", href: "neighborhoods/richmond.html", available: true },
    { name: "Wandsworth & Putney", tag: "South West London", hook: "Good schools and a towpath commute, for people who left the excitement behind on purpose.", x: 175.1, y: 401.2, side: "right", href: "neighborhoods/wandsworth-putney.html", available: true },
    { name: "Battersea", tag: "South West London", hook: "New-build riverside towers where the Power Station used to be — south bank, directly across from Chelsea.", x: 261.4, y: 343.5, side: "right", href: "neighborhoods/battersea.html", available: true },
    { name: "Clapham", tag: "South West London", hook: "Young professionals, commons, and a commute that actually works.", x: 287.8, y: 389, side: "right", href: "neighborhoods/clapham.html", available: true },
    { name: "Brixton", tag: "South London", hook: "Market stalls, live music, and a nightlife scene that hasn't been sanded down yet.", x: 330, y: 410, side: "right", href: "neighborhoods/brixton.html", available: true },
    { name: "Shoreditch", tag: "East London", hook: "Warehouses turned studios, and the fastest-changing postcode on this whole list.", x: 380.8, y: 159.4, side: "right", href: "neighborhoods/shoreditch.html", available: true },
    { name: "Hackney", tag: "East London", hook: "Creative, fast-changing, and one of the most talked-about areas in the city.", x: 413, y: 76.3, side: "right", href: "neighborhoods/hackney.html", available: true },
    { name: "Canary Wharf", tag: "East London", hook: "Glass towers built specifically for the relocation-package crowd — if that's you, this is home. Sits on the Isle of Dogs, wrapped by the river on three sides.", x: 458.7, y: 225.2, side: "right", href: "neighborhoods/canary-wharf.html", available: true },
    { name: "Greenwich", tag: "South East London", hook: "Maritime history, a park with a view of the whole city, and prices that still make sense — south bank, just past the river's tightest bend.", x: 491.2, y: 331.4, side: "right", href: "neighborhoods/greenwich.html", available: true }
  ];

  var pointEls = [];

  function select(i) {
    var n = NEIGHBOURHOODS[i];
    mpTag.textContent = n.tag;
    mpTitle.textContent = n.name;
    mpHook.textContent = n.hook;
    mpLink.href = n.href;
    mpLink.textContent = n.available ? "Explore " + n.name + " →" : "Coming soon →";
    pointEls.forEach(function (el, j) {
      el.classList.toggle("active", j === i);
    });
    svg.classList.add("locked");
  }

  NEIGHBOURHOODS.forEach(function (n, i) {
    var g = document.createElementNS(NS, "g");
    g.setAttribute("class", "geo-point");
    g.setAttribute("tabindex", "0");
    g.setAttribute("role", "button");
    g.setAttribute("aria-label", "Preview " + n.name);

    var hit = document.createElementNS(NS, "circle");
    hit.setAttribute("cx", n.x);
    hit.setAttribute("cy", n.y);
    hit.setAttribute("r", 14);
    hit.setAttribute("fill", "transparent");

    var dot = document.createElementNS(NS, "circle");
    dot.setAttribute("class", "pt-dot");
    dot.setAttribute("cx", n.x);
    dot.setAttribute("cy", n.y);
    dot.setAttribute("r", 5);

    var label = document.createElementNS(NS, "text");
    label.setAttribute("class", "pt-label");
    label.setAttribute("y", n.y + 4);
    if (n.side === "left") {
      label.setAttribute("x", n.x - 10);
      label.setAttribute("text-anchor", "end");
    } else {
      label.setAttribute("x", n.x + 10);
      label.setAttribute("text-anchor", "start");
    }
    label.textContent = n.name;

    g.appendChild(hit);
    g.appendChild(dot);
    g.appendChild(label);
    svg.appendChild(g);
    pointEls.push(g);

    g.addEventListener("mouseenter", function () { select(i); });
    g.addEventListener("click", function (e) { e.preventDefault(); select(i); });
    g.addEventListener("focus", function () { select(i); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(i); }
    });
  });

  var defaultIndex = NEIGHBOURHOODS.map(function (n) { return n.name; }).indexOf("Clapham");
  select(defaultIndex < 0 ? 0 : defaultIndex);
  svg.classList.remove("locked");
});
