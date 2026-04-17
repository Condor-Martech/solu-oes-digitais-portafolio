import { projects } from "./data.js";
import { $, escapeHTML, firstParagraph, tagsHTML, allUniqueTags } from "./utils.js";
import { openModal, initModal } from "./modal.js";

const grid = $("#grid");
const filters = $("#filters");
const count = $("#count");

const state = { activeTag: readTagFromURL() };

function readTagFromURL(){
  const t = new URLSearchParams(location.search).get("tag");
  if (!t) return "Tudo";
  return projects.some(p => p.tags.includes(t)) ? t : "Tudo";
}

function writeTagToURL(tag){
  const url = new URL(location.href);
  if (tag === "Tudo") url.searchParams.delete("tag");
  else url.searchParams.set("tag", tag);
  history.replaceState(null, "", url);
}

function setActiveTag(tag){
  state.activeTag = tag;
  writeTagToURL(tag);
  renderFilters();
  renderGrid();
}

function countFor(tag){
  return tag === "Tudo"
    ? projects.length
    : projects.filter(p => p.tags.includes(tag)).length;
}

function renderFilters(){
  const tags = ["Tudo", ...allUniqueTags(projects)];
  filters.innerHTML = tags.map(t => `
    <button class="chip" type="button" data-tag="${escapeHTML(t)}" aria-pressed="${t === state.activeTag}">
      ${escapeHTML(t)}<span class="n" aria-hidden="true">${countFor(t)}</span>
      <span class="sr-only">${countFor(t)} projetos</span>
    </button>
  `).join("");
  filters.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => setActiveTag(btn.dataset.tag));
  });
}

function cardHTML(p, i){
  const idx = projects.indexOf(p);
  const delay = Math.min(i * 55, 420);
  return `
    <article class="card" style="animation-delay:${delay}ms">
      <div class="cover">
        <img data-idx="${idx}" src="${escapeHTML(p.image)}" alt="" loading="lazy" />
        <div class="cover-label" aria-hidden="true"><span>Ver detalhes</span></div>
      </div>
      <div class="body">
        <div class="head-row">
          <h3 class="name">
            <button class="name-btn" type="button" data-idx="${idx}"
              aria-label="Abrir detalhes de ${escapeHTML(p.title)}">${escapeHTML(p.title)}</button>
          </h3>
          <a class="ext" href="${escapeHTML(p.link)}" target="_blank" rel="noopener noreferrer"
            aria-label="${escapeHTML(p.linkLabel || "Visitar")} — ${escapeHTML(p.title)} (abre em nova aba)">
            ${escapeHTML(p.linkLabel || "Visitar")}
          </a>
        </div>
        <p class="snippet">${firstParagraph(p.desc)}</p>
        <div class="tags" aria-label="Tags">${tagsHTML(p.tags)}</div>
      </div>
    </article>
  `;
}

function emptyHTML(){
  return `
    <div class="empty" role="status">
      <h3 class="empty-title">Nenhum projeto encontrado</h3>
      <p class="empty-sub">Nenhum item corresponde ao filtro "${escapeHTML(state.activeTag)}"</p>
      <button class="empty-action" type="button" id="emptyReset">Limpar filtro</button>
    </div>
  `;
}

function renderGrid(){
  const list = state.activeTag === "Tudo"
    ? projects
    : projects.filter(p => p.tags.includes(state.activeTag));

  count.innerHTML = `<b>${list.length}</b> ${list.length === 1 ? "projeto" : "projetos"}`;

  if (!list.length){
    grid.innerHTML = emptyHTML();
    grid.querySelector("#emptyReset").addEventListener("click", () => setActiveTag("Tudo"));
    return;
  }

  grid.innerHTML = list.map(cardHTML).join("");

  grid.querySelectorAll(".name-btn").forEach(btn => {
    btn.addEventListener("click", () => openModal(projects[+btn.dataset.idx]));
  });

  grid.querySelectorAll(".cover img").forEach(img => {
    img.addEventListener("error", () => img.classList.add("is-broken"));
  });
}

function init(){
  document.getElementById("year").textContent = new Date().getFullYear();
  initModal();
  renderFilters();
  renderGrid();
}

init();
