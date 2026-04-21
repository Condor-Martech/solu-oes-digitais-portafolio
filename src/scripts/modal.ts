/**
 * Controlador de cliente para el modal de proyectos.
 * Se encarga de la manipulación del DOM y la sincronización con el Custom Element BaseModal.
 */

export function initProjectModal(modalData: Record<string, any>) {
  const modal = document.getElementById('projectModal') as any;
  const mImg = document.getElementById('modalImg') as HTMLImageElement;
  const mTitle = document.getElementById('modalTitle');
  const mCrumb = document.getElementById('modalCrumb');
  const mDesc = document.getElementById('modalDesc');
  const mTags = document.getElementById('modalTags');
  const mLink = document.getElementById('modalLink') as HTMLAnchorElement;
  const mStatusDot = document.getElementById('modalStatusDot');
  const mStatusLabel = document.getElementById('modalStatusLabel');

  if (!modal) return;

  function tagHTML(label: string, themeClass: string) {
    return `<span class="inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] sm:text-[11px] font-medium font-mono uppercase tracking-[0.05em] border-[0.5px] border-line border-opacity-10 ${themeClass}">${label}</span>`;
  }

  function updateModal(p: any) {
    if (mImg) {
      mImg.src = p.image || '';
      mImg.alt = `Captura de ${p.title}`;
    }
    if (mTitle) mTitle.textContent = p.title;
    if (mCrumb) mCrumb.textContent = p.company || 'Projeto';
    if (mStatusLabel) mStatusLabel.textContent = p.status;
    
    if (mStatusDot) {
      mStatusDot.className = `w-1.5 h-1.5 rounded-full ${p.status === 'No ar' ? 'bg-green-500 shadow-[0_0_8px_oklch(0.62_0.19_145_/_0.4)]' : 'bg-red-500'}`;
    }
    
    if (mDesc) {
      mDesc.innerHTML = p.descParagraphs.map((para: string) => `<p>${para}</p>`).join('');
    }
    
    if (mTags) {
      mTags.innerHTML = [
        tagHTML(p.company, p.theme.company),
        tagHTML(p.production, p.theme.production),
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
