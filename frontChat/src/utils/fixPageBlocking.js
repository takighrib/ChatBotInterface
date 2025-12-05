/**
 * Utilitaire pour débloquer la page en cas de problème
 * À exécuter dans la console du navigateur si la page est bloquée
 */

export const fixPageBlocking = () => {
  // 1. Restaurer le scroll du body
  document.body.style.overflow = '';
  document.body.style.overflow = 'unset';
  
  // 2. Fermer tous les modals potentiellement ouverts
  const modals = document.querySelectorAll('[class*="fixed"][class*="inset-0"][class*="z-50"]');
  modals.forEach(modal => {
    if (modal.style.display !== 'none') {
      modal.style.display = 'none';
    }
  });
  
  // 3. Forcer la fermeture du modal d'onboarding
  localStorage.setItem('user_settings', JSON.stringify({ onboarded: true }));
  
  // 4. Supprimer tous les overlays bloquants
  const overlays = document.querySelectorAll('[class*="backdrop-blur"]');
  overlays.forEach(overlay => {
    const parent = overlay.closest('[class*="fixed"]');
    if (parent && parent.style.zIndex >= 40) {
      parent.style.display = 'none';
    }
  });
  
  console.log('✅ Page débloquée ! Rafraîchissez la page si nécessaire.');
};

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  window.fixPageBlocking = fixPageBlocking;
}

