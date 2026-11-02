// Año del pie de página
document.getElementById("year").textContent = new Date().getFullYear();

// Menú lateral en móvil
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");

function setMenu(open) {
  sidebar.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}
menuBtn.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
sidebar.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Marcar la sección visible en el menú
const links = document.querySelectorAll(".sidebar nav a");
const sections = [...links].map((a) => document.querySelector(a.getAttribute("href")));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && observer.observe(s));

// Formulario de contacto
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");

function showMsg(text, type) {
  msg.textContent = text;
  msg.className = type;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  if (!data.get("nombre").trim() || !data.get("consulta").trim()) {
    return showMsg("Completa tu nombre y tu consulta.", "error");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.get("correo"))) {
    return showMsg("Escribe un correo electrónico válido.", "error");
  }

  const btn = form.querySelector("button");
  btn.disabled = true;
  showMsg("Enviando…", "");

  try {
    const res = await fetch(form.action, { method: "POST", body: data });
    const json = await res.json();
    showMsg(json.mensaje, json.ok ? "ok" : "error");
    if (json.ok) form.reset();
  } catch (err) {
    showMsg("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.", "error");
  } finally {
    btn.disabled = false;
  }
});
