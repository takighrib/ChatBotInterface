import React, { useState, useEffect } from 'react';
import { Lightbulb, Trash2, Download, Calendar, MessageSquare, Image, FileText, Sparkles } from 'lucide-react';
import { projectStorage } from '@services/storage/projectStorage';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import { ConfirmModal } from '@components/common/Modal';
import Notification from '@components/common/Notification';

const ExperimentationPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = projectStorage.getAllProjects();
    setProjects(allProjects);
  };

  const handleDelete = (projectId) => {
    const success = projectStorage.deleteProject(projectId);
    if (success) {
      loadProjects();
      setNotification({ type: 'success', message: 'Projet supprimé avec succès' });
      setTimeout(() => setNotification(null), 3000);
    }
    setDeleteConfirm(null);
  };

  const handleExport = () => {
    const jsonData = projectStorage.exportProjects();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projets-ia-${new Date().toISOString()}.json`;
    a.click();
    
    setNotification({ type: 'success', message: 'Projets exportés avec succès' });
    setTimeout(() => setNotification(null), 3000);
  };

  const getModuleIcon = (module) => {
    switch (module) {
      case 'chatbot':
        return <MessageSquare className="w-5 h-5" />;
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'text':
        return <FileText className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getModuleColor = (module) => {
    switch (module) {
      case 'chatbot':
        return 'bg-brand-mint';
      case 'image':
        return 'bg-brand-accent/20';
      case 'text':
        return 'bg-brand-mint';
      default:
        return 'bg-brand-grey';
    }
  };

  return (
    <div className="min-h-screen bg-brand-paper py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        {notification && (
          <div className="fixed top-20 right-4 z-50">
            <Notification 
              type={notification.type} 
              message={notification.message}
              onClose={() => setNotification(null)}
            />
          </div>
        )}

        {/* En-tête */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-brand-mint p-3 rounded-xl shadow-lg">
                <Lightbulb className="w-8 h-8 text-brand-slate" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                  Mes Expériences
                </h1>
                <p className="text-text-secondary mt-1">
                  Retrouve tous tes projets et expérimentations IA
                </p>
              </div>
            </div>

            {projects.length > 0 && (
              <Button
                variant="outline"
                onClick={handleExport}
                icon={<Download className="w-5 h-5" />}
              >
                Exporter tout
              </Button>
            )}
          </div>

          {/* Statistiques */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center border-l-4 border-brand-mint">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total de projets</p>
                  <p className="text-3xl font-bold text-text-primary">{projects.length}</p>
                </div>
                <div className="bg-brand-mint p-3 rounded-lg">
                  <Lightbulb className="w-6 h-6 text-brand-slate" />
                </div>
              </div>
            </Card>

            <Card className="text-center border-l-4 border-brand-accent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Conversations</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {projects.filter(p => p.module === 'chatbot').length}
                  </p>
                </div>
                <div className="bg-brand-accent/20 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-brand-accent" />
                </div>
              </div>
            </Card>

            <Card className="text-center border-l-4 border-brand-mint">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Analyses</p>
                  <p className="text-3xl font-bold text-text-primary">
                    {projects.filter(p => p.module === 'image' || p.module === 'text').length}
                  </p>
                </div>
                <div className="bg-brand-mint p-3 rounded-lg">
                  <FileText className="w-6 h-6 text-brand-slate" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Liste des projets */}
        {projects.length === 0 ? (
          <Card className="text-center border-l-4 border-brand-mint animate-slide-up">
            <Lightbulb className="w-16 h-16 text-brand-grey mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              Aucun projet pour le moment
            </h3>
            <p className="text-text-secondary mb-6">
              Commence à utiliser nos modules IA pour créer tes premiers projets !
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="primary" onClick={() => navigate(ROUTES.CHATBOT)}>
                Découvrir les modules
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Tous les projets ({projects.length})
            </h2>
            
            {projects.map((project, index) => (
              <Card
                key={project.id}
                className="border-l-4 border-brand-mint hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                    <div className={`${getModuleColor(project.module)} p-3 rounded-lg text-brand-slate`}>
                        {getModuleIcon(project.module)}
                      </div>
                      
                      <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-2">
                          {project.title || 'Projet sans titre'}
                        </h3>
                        
                        {project.description && (
                        <p className="text-text-secondary mb-3 text-sm">
                            {project.description}
                          </p>
                        )}
                        
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          
                        <Badge variant="mint" size="sm">
                            {project.module === 'chatbot' ? 'Chatbot' : 
                             project.module === 'image' ? 'Image' : 'Texte'}
                        </Badge>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setDeleteConfirm(project.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Supprimer le projet"
        message="Es-tu sûr de vouloir supprimer ce projet ? Cette action est irréversible."
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};

export default ExperimentationPage;
