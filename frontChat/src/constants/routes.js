export const ROUTES = {
  HOME: '/',
  CHATBOT: '/chatbot',
  IMAGE_RECOGNITION: '/image-recognition',
  TEXT_CLASSIFICATION: '/text-classification',
  DOCUMENTATION: '/documentation',
  EXPERIMENTATION: '/experimentation',
  ALGORITHMS: '/algorithms',
  LINEAR_REGRESSION: '/linear-regression',
  DECISION_TREE: '/decision-tree',
  KMEANS: '/kmeans',
  NEURAL_NETWORK: '/neural-network',
  ABOUT: '/about',
  LOGIN: '/login',
  REGISTER: '/register',
  BLOG: '/blog',
  BLOG_CREATE: '/blog/create',
  BLOG_ARTICLE: '/blog/:id',
  BLOG_EDIT: '/blog/edit/:id'
};

// ======================================
// NAV_ITEMS : Navigation principale (Header)
// ======================================
export const NAV_ITEMS = [
  {
    name: 'Accueil',
    path: ROUTES.HOME,
    icon: 'Home'
  },
  {
    name: 'Chatbot',
    path: ROUTES.CHATBOT,
    icon: 'MessageSquare'
  },
  {
    name: 'Algorithmes',
    path: ROUTES.ALGORITHMS,
    icon: 'Brain'
  },
  {
    name: 'Images',
    path: ROUTES.IMAGE_RECOGNITION,
    icon: 'Image'
  },
  {
    name: 'Textes',
    path: ROUTES.TEXT_CLASSIFICATION,
    icon: 'FileText'
  },
  {
    name: 'ML Lab',
    path: ROUTES.EXPERIMENTATION,
    icon: 'Lightbulb'
  },
  {
    name: 'Docs',
    path: ROUTES.DOCUMENTATION,
    icon: 'BookOpen'
  },
  {
    name: 'Blog',
    path: ROUTES.BLOG,
    icon: 'BookOpen'
  }
];

// ======================================
// ML_MODULES : Modules d'apprentissage ML
// ======================================
export const ML_MODULES = [
  {
    name: 'Régression Linéaire',
    path: ROUTES.LINEAR_REGRESSION,
    icon: 'TrendingUp',
    description: 'Prédire des valeurs continues',
    category: 'supervised',
    difficulty: 'beginner'
  },
  {
    name: 'Arbre de Décision',
    path: ROUTES.DECISION_TREE,
    icon: 'GitBranch',
    description: 'Classification par arbre',
    category: 'supervised',
    difficulty: 'intermediate'
  },
  {
    name: 'K-Means',
    path: ROUTES.KMEANS,
    icon: 'Circle',
    description: 'Clustering non supervisé',
    category: 'unsupervised',
    difficulty: 'intermediate'
  },
  {
    name: 'Réseau de Neurones',
    path: ROUTES.NEURAL_NETWORK,
    icon: 'Network',
    description: 'Deep Learning basique',
    category: 'deep-learning',
    difficulty: 'advanced'
  }
];

// ======================================
// ML_CATEGORIES : Catégories des modules
// ======================================
export const ML_CATEGORIES = {
  supervised: {
    name: 'Apprentissage Supervisé',
    description: 'Apprendre à partir de données étiquetées',
    color: 'blue'
  },
  unsupervised: {
    name: 'Apprentissage Non Supervisé',
    description: 'Découvrir des patterns dans les données',
    color: 'purple'
  },
  'deep-learning': {
    name: 'Deep Learning',
    description: 'Réseaux de neurones profonds',
    color: 'green'
  }
};

// ======================================
// DIFFICULTY_LEVELS : Niveaux de difficulté
// ======================================
export const DIFFICULTY_LEVELS = {
  beginner: {
    label: 'Débutant',
    color: 'green',
    icon: '🌱'
  },
  intermediate: {
    label: 'Intermédiaire',
    color: 'yellow',
    icon: '🌿'
  },
  advanced: {
    label: 'Avancé',
    color: 'red',
    icon: '🌳'
  }
};

// ======================================
// HELPER FUNCTIONS
// ======================================

/**
 * Récupère les modules ML par catégorie
 */
export const getModulesByCategory = (category) => {
  return ML_MODULES.filter(module => module.category === category);
};

/**
 * Récupère les modules ML par difficulté
 */
export const getModulesByDifficulty = (difficulty) => {
  return ML_MODULES.filter(module => module.difficulty === difficulty);
};

/**
 * Vérifie si une route est publique (accessible sans connexion)
 */
export const isPublicRoute = (path) => {
  const publicRoutes = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.ABOUT];
  return publicRoutes.includes(path);
};

/**
 * Récupère les infos d'un module par son path
 */
export const getModuleByPath = (path) => {
  return ML_MODULES.find(module => module.path === path);
};