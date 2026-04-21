/**
 * Controlador de cliente para la barra de filtros.
 */

export function initFilterBar() {
  const btn = document.getElementById('filterBtn');
  const drawer = document.getElementById('filterDrawer') as any;

  if (btn && drawer) {
    btn.addEventListener('click', () => drawer.open());
  }

  // Podríamos añadir lógica de scroll o efectos aquí
}
