import { tagPalette } from "./data.js";

export const $ = s => document.querySelector(s);

export function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function hash(s){
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function colorForTag(tag){
  return tagPalette[hash(tag) % tagPalette.length];
}

export function descToHTML(desc){
  return desc.split(/\n+/).map(p => `<p>${escapeHTML(p)}</p>`).join("");
}

export function firstParagraph(desc){
  return escapeHTML(desc.split(/\n+/)[0]);
}

export function tagsHTML(tags){
  return tags.map(t => {
    const c = colorForTag(t);
    return `<span class="tag" style="background:${c.bg};color:${c.fg};border-color:${c.fg}24">${escapeHTML(t)}</span>`;
  }).join("");
}

export function allUniqueTags(projects){
  const s = new Set();
  projects.forEach(p => p.tags.forEach(t => s.add(t)));
  return [...s];
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function trapFocus(container, event){
  if (event.key !== "Tab") return;
  const focusable = [...container.querySelectorAll(FOCUSABLE)]
    .filter(el => el.offsetParent !== null || el === document.activeElement);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first){
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last){
    event.preventDefault();
    first.focus();
  }
}
