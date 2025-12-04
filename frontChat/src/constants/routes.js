// ==============================
// ROUTES : chemins de navigation
// ==============================
export const ROUTES = {
  HOME: '/',
  CHATBOT: '/chatbot',
  IMAGE_RECOGNITION: '/image-recognition',
  TEXT_CLASSIFICATION: '/text-classification',
  DOCUMENTATION: '/documentation',
  EXPERIMENTATION: '/experimentation',
  ABOUT: '/about',

  // === Routes IA avancées ===
  DecisionTreePage: '/decision-tree',
  KMeansPage: '/kmeans',
  LinearRegressionPage: '/linear-regression',
  NeuralNetworkPage: '/neural-network'
};


// ======================================
// NAV_ITEMS : éléments visibles dans le menu
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
    name: 'Documentation',
    path: ROUTES.DOCUMENTATION,
    icon: 'BookOpen'
  },
  {
    name: 'Mes Projets',
    path: ROUTES.EXPERIMENTATION,
    icon: 'Lightbulb'
  },

  // === Modules IA interactifs ===
  {
    name: 'Decision Tree',
    path: ROUTES.DecisionTreePage,
    icon: 'GitBranch'
  },
  {
    name: 'K-Means',
    path: ROUTES.KMeansPage,
    icon: 'ScatterPlot'
  },
  {
    name: 'Linear Regression',
    path: ROUTES.LinearRegressionPage,
    icon: 'TrendingUp'
  },
  {
    name: 'Neural Network',
    path: ROUTES.NeuralNetworkPage,
    icon: 'Network'
  }
];