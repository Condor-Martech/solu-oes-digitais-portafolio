import { $, descToHTML, tagsHTML, trapFocus } from "./utils.js";

const modal = $("#modal");
const sheet = modal.querySelector(".sheet");
const mImg = $("#mImg");
const mTitle = $("#mTitle");
const mCrumb = $("#mCrumb");
const mDesc = $("#mDesc");
const mTags = $("#mTags");
const mLink = $("#mLink");
const mClose = $("#mClose");

let lastFocus = null;
let scrollY = 0;

function lockScroll(){
  scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockScroll(){
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollY);
}

export function openModal(p){
  lastFocus = document.activeElement;
  mImg.src = p.image;
  mImg.alt = `Captura de ${p.title}`;
  mTitle.textContent = p.title;
  mCrumb.textContent = (p.tags && p.tags[0]) ? p.tags[0] : "Projeto";
  mDesc.innerHTML = descToHTML(p.desc);
  mTags.innerHTML = tagsHTML(p.tags);
  mLink.href = p.link;
  mLink.textContent = p.linkLabel || "Visitar site";

  modal.hidden = false;
  requestAnimationFrame(() => modal.classList.add("open"));
  lockScroll();
  mClose.focus();
}

export function closeModal(){
  modal.classList.remove("open");
  unlockScroll();
  setTimeout(() => {
    modal.hidden = true;
    if (lastFocus && lastFocus.isConnected) lastFocus.focus();
  }, 220);
}

export function initModal(){
  mClose.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (modal.hidden) return;
    if (e.key === "Escape"){ closeModal(); return; }
    trapFocus(sheet, e);
  });
}
