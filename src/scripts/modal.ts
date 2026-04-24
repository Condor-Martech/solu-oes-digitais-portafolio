/**
 * Controlador de cliente para el modal de proyectos.
 * Se encarga de la manipulación del DOM y la sincronización con el Custom Element BaseModal.
 */

export function initProjectModal(modalData: Record<string, any>) {
  const modal = document.getElementById('projectModal') as any;
  const mImg = document.getElementById('modalImg') as HTMLImageElement;
  const mTitle = document.getElementById('modalTitle');
  const mCompanyLogo = document.getElementById('modalCompanyLogo') as HTMLImageElement;
  const mDesc = document.getElementById('modalDesc');
  const mTags = document.getElementById('modalTags');
  const mLink = document.getElementById('modalLink') as HTMLAnchorElement;
  const mStatusDot = null;
  const mStatusLabel = null;
  const mGalleryImgs = document.querySelectorAll('[data-gallery-img]');

  if (!modal) return;

  function tagHTML(label: string, themeClass: string) {
    return `<span class="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] sm:text-[11px] font-medium font-mono uppercase tracking-[0.05em] border-[0.5px] border-line border-opacity-10 ${themeClass}">${label}</span>`;
  }

  function updateModal(p: any) {
    if (mImg) {
      if (p.image) {
        mImg.src = p.image;
        mImg.classList.remove('opacity-0');
        mImg.classList.add('opacity-100');
      } else {
        mImg.removeAttribute('src');
        mImg.classList.add('opacity-0');
        mImg.classList.remove('opacity-100');
      }
      mImg.alt = `Captura de ${p.title}`;
    }
    if (mTitle) mTitle.textContent = p.title;
    
    if (mDesc) {
      mDesc.innerHTML = (p.descParagraphs || []).map((para: string) => `<p>${para}</p>`).join('');
    }
    
    if (mTags) {
      mTags.innerHTML = [
        ...(p.theme.types || []).map((t: any) => tagHTML(t.label, t.classes))
      ].join('');
    }

    if (mLink) {
      if (p.link) {
        mLink.href = p.link;
        mLink.classList.add('active');
        mLink.classList.remove('hidden');
      } else {
        mLink.classList.remove('active');
        mLink.classList.add('hidden');
      }
    }

    if (mGalleryImgs) {
      mGalleryImgs.forEach((imgEl, idx) => {
        const img = imgEl as HTMLImageElement;
        const src = p.gallery && p.gallery[idx];
        if (src) {
          img.src = src;
          img.classList.remove('opacity-0');
          img.classList.add('opacity-100');
        } else {
          img.removeAttribute('src');
          img.classList.add('opacity-0');
          img.classList.remove('opacity-100');
        }
      });
    }
  }

  // Delegación de eventos para los botones que abren el modal
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-open-project]');
    if (btn) {
      const id = btn.getAttribute('data-open-project');
      const p = id ? modalData[id] : null;
      if (p) {
        updateModal(p);
        modal.open();
      }
    }
  });
}
