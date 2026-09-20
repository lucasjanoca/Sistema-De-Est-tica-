/* InfoTech.io | Fecha o menu lateral móvel ao tocar fora, sem acionar o conteúdo atrás. */
(() => {
  'use strict';
  const mobile = () => window.matchMedia('(max-width: 760px)').matches;
  const sidebar = () => document.querySelector('.sidebar');

  function isOpen() {
    if (!mobile()) return false;
    const menu = sidebar();
    if (!menu) return false;
    const rect = menu.getBoundingClientRect();
    const css = window.getComputedStyle(menu);
    // A barra fechada é deslocada para fora da tela. Use a posição real
    // em vez de adivinhar qual classe o código principal alterna.
    return rect.width > 0 && rect.height > 0 &&
      rect.left >= -12 && rect.right > Math.min(72, window.innerWidth * 0.25) &&
      css.display !== 'none' && css.visibility !== 'hidden' &&
      Number(css.opacity) !== 0;
  }

  function closeMenu() {
    if (!isOpen()) return false;
    // Usa o próprio controle do aplicativo para manter classe, animação
    // e estado de acessibilidade sincronizados.
    const toggle = document.querySelector('[data-action="toggle-menu"]');
    if (!toggle) return false;
    toggle.click();
    return true;
  }

  document.addEventListener('click', (event) => {
    if (!isOpen()) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (sidebar()?.contains(target) || target.closest('[data-action="toggle-menu"]')) return;
    // Um toque na área externa apenas fecha o menu: não dispara botões
    // ou links que ficaram atrás dele.
    event.preventDefault();
    event.stopImmediatePropagation();
    closeMenu();
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !isOpen()) return;
    event.preventDefault();
    if (closeMenu()) document.querySelector('[data-action="toggle-menu"]')?.focus();
  });
})();
