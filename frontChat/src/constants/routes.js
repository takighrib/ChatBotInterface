export const ROUTES = {
  HOME: '/',
  CHATBOT: '/chatbot',
  IMAGE_RECOGNITION: '/image-recognition',
  TEXT_CLASSIFICATION: '/text-classification',
  DOCUMENTATION: '/documentation',
  EXPERIMENTATION: '/experimentation',
  ABOUT: '/about'
};

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
  }
];