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
