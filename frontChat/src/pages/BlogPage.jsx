import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  User, 
  Tag, 
  BookOpen, 
  ChevronRight,
  Search,
  Filter,
  Clock,
  Eye,
  Heart,
  Plus,
  TrendingUp,
  ArrowRight,
  Users,
  GraduationCap
} from 'lucide-react';
import { blogService } from '@services/api/blogService';
import Button from '@components/common/Button';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Pagination from '@components/common/Pagination';
import LoadingSpinner from '@components/common/LoadingSpinner';
import Notification from '@components/common/Notification';
import { formatDate } from '@utils/dateFormatter';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterAndPaginateArticles();
  }, [articles, selectedCategory, selectedTag, searchQuery, sortBy, currentPage]);

const fetchInitialData = async () => {
  try {
    setLoading(true);
    const [articlesData, categoriesData, tagsData] = await Promise.all([
      blogService.getArticles(),
      blogService.getCategories(),
      blogService.getTags()
    ]);

    // ✅ Gérer le format de retour de getArticles
    const articles = articlesData?.articles || [];
    setArticles(articles);
    
    // ✅ S'assurer que ce sont des tableaux (double sécurité)
    setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    setTags(Array.isArray(tagsData) ? tagsData : []);
    
    setTotalPages(Math.ceil((articlesData?.total || articles.length) / articlesPerPage));
  } catch (err) {
    console.error('fetchInitialData error:', err);
    setError(err.message || 'Erreur lors du chargement des données');
    // ✅ Garantir que les états restent cohérents
    setArticles([]);
    setCategories([]);
    setTags([]);
  } finally {
    setLoading(false);
  }
};

  const filterAndPaginateArticles = () => {
    let filtered = [...articles];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.category?.id === selectedCategory
      );
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(article =>
        article.tags?.some(tag => tag.id === selectedTag)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.author?.name.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'most_liked':
        filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        break;
      default:
        break;
    }

    const startIndex = (currentPage - 1) * articlesPerPage;
    const paginated = filtered.slice(startIndex, startIndex + articlesPerPage);

    setFilteredArticles(paginated);
    setTotalPages(Math.ceil(filtered.length / articlesPerPage));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchInitialData();
      return;
    }

    try {
      setLoading(true);
      const results = await blogService.searchArticles(searchQuery);
      setArticles(results.articles || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedTag('all');
    setSearchQuery('');
    setSortBy('latest');
    setCurrentPage(1);
    fetchInitialData();
  };

  const featuredArticle = articles.length > 0 ? articles[0] : null;

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex p-3 bg-white/10 rounded-full mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Éducatif</h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto mb-8">
            Ressources, conseils et actualités pour les étudiants et professeurs
          </p>

          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              type="search"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              icon={<Search className="w-5 h-5 text-gray-400" />}
            />
            <Button onClick={handleSearch}>Rechercher</Button>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {error && (
          <Notification type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* ARTICLE VEDETTE */}
        {featuredArticle && (
          <Card className="overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-2/3 p-8">
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="primary" className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    À la une
                  </Badge>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredArticle.created_at)}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {featuredArticle.title}
                </h2>

                <p className="text-gray-600 mb-6">
                  {featuredArticle.excerpt ||
                    featuredArticle.content.substring(0, 200)}...
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4" />
                    <span>{featuredArticle.author?.name}</span>

                    {featuredArticle.category && (
                      <Badge variant="outline">{featuredArticle.category.name}</Badge>
                    )}
                  </div>

                  <Link to={`/blog/article/${featuredArticle.id}`}>
                    <Button variant="primary" icon={<ArrowRight />}>
                      Lire l'article
                    </Button>
                  </Link>
                </div>
              </div>

              {/* IMAGE */}
              <div className="md:w-1/3 relative">
                {featuredArticle.image_url ? (
                  <img
                    src={featuredArticle.image_url}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <BookOpen className="w-20 h-20 text-blue-300" />
                  </div>
                )}

                <div className="absolute bottom-0 p-4 w-full bg-black/40 text-white flex justify-between">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> {featuredArticle.views || 0} vues
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> {featuredArticle.likes_count || 0} likes
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* FILTRES */}
        <div className="mb-8 flex flex-col md:flex-row justify-between gap-4">

          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Filtrer par :</span>

            <Select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'Toutes catégories' },
                ...categories.map(c => ({ value: c.id, label: c.name }))
              ]}
            />

            <Select
              value={selectedTag}
              onChange={(e) => { setSelectedTag(e.target.value); setCurrentPage(1); }}
              options={[
                { value: 'all', label: 'Tous les tags' },
                ...tags.map(t => ({ value: t.id, label: t.name }))
              ]}
            />

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'latest', label: 'Plus récents' },
                { value: 'popular', label: 'Plus populaires' },
                { value: 'most_liked', label: 'Plus aimés' },
              ]}
            />
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetFilters}>Réinitialiser</Button>
            <Link to="/blog/create">
              <Button variant="primary" icon={<Plus />}>Nouvel article</Button>
            </Link>
          </div>
        </div>

        {/* LISTE DES ARTICLES */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Aucun article trouvé</h3>
            <Button onClick={handleResetFilters} className="mt-6">Voir tous les articles</Button>
          </Card>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

      </div>

    </div>
  );
};

/* --------------------------------------------------------- */
/* ARTICLE CARD */
/* --------------------------------------------------------- */

const ArticleCard = ({ article }) => (
  <Card className="group hover:shadow-xl transition-all duration-300 h-full flex flex-col">
    <div className="relative h-48 overflow-hidden rounded-t-lg">
      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-blue-300" />
        </div>
      )}

      {article.category && (
        <div className="absolute top-3 left-3">
          <Badge variant="primary">{article.category.name}</Badge>
        </div>
      )}
    </div>

    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <span className="flex items-center gap-1 text-gray-600 text-sm">
          <Calendar className="w-4 h-4" /> {formatDate(article.created_at)}
        </span>
        <span className="flex items-center gap-1 text-gray-600 text-sm">
          <Clock className="w-4 h-4" /> {Math.ceil(article.content.length / 1000)} min
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {article.title}
      </h3>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {article.excerpt || article.content.substring(0, 130)}...
      </p>

      <div className="mt-auto flex items-center justify-between pt-4 border-t">
        <span className="flex items-center gap-1 text-gray-600 text-sm">
          <Eye className="w-4 h-4" /> {article.views || 0}
        </span>
        <span className="flex items-center gap-1 text-gray-600 text-sm">
          <Heart className="w-4 h-4" /> {article.likes_count || 0}
        </span>
        <Link to={`/blog/article/${article.id}`}>
          <Button variant="link" className="text-blue-600">Lire</Button>
        </Link>
      </div>
    </div>
  </Card>
);

export default BlogPage;
