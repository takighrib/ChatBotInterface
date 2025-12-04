/**
 * Formate une date en format lisible : "12 Janvier 2025"
 */
export const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formate une date + heure : "12 Janvier 2025 à 14:35"
 */
export const formatDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);

  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }) + " à " + d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Renvoie un format court : "12/01/2025"
 */
export const formatShortDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR");
};
