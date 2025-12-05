const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const blogService = {
  // Articles
  async getArticles(category = null, tag = null, limit = 20, skip = 0) {
    try {
      let url = `${API_BASE_URL}/blog/articles?limit=${limit}&skip=${skip}`;
      if (category) url += `&category=${category}`;
      if (tag) url += `&tag=${tag}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      
      // ✅ Garantir le format de retour
      return {
        articles: Array.isArray(data) ? data : (data.articles || []),
        total: data.total || 0
      };
    } catch (error) {
      console.error('getArticles error:', error);
      return { articles: [], total: 0 };
    }
  },

  async getArticle(id) {
    const response = await fetch(`${API_BASE_URL}/blog/articles/${id}`);
    if (!response.ok) throw new Error('Article not found');
    return response.json();
  },

  async createArticle(articleData, token) {
    const response = await fetch(`${API_BASE_URL}/blog/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(articleData)
    });
    
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },

  async updateArticle(id, articleData, token) {
    const response = await fetch(`${API_BASE_URL}/blog/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(articleData)
    });
    
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  },

  async deleteArticle(id, token) {
    const response = await fetch(`${API_BASE_URL}/blog/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
  },

  // Likes
  async toggleLike(articleId, token) {
    const response = await fetch(`${API_BASE_URL}/blog/articles/${articleId}/like`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Failed to toggle like');
    return response.json();
  },

  // Comments
  async addComment(articleId, content, token) {
    const response = await fetch(`${API_BASE_URL}/blog/articles/${articleId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) throw new Error('Failed to add comment');
    return response.json();
  },

  async getComments(articleId) {
    const response = await fetch(`${API_BASE_URL}/blog/articles/${articleId}/comments`);
    if (!response.ok) throw new Error('Failed to fetch comments');
    return response.json();
  },

  // Categories & Tags - ✅ CORRECTIONS ICI
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/categories`);
      if (!response.ok) {
        console.warn('Failed to fetch categories');
        return []; // ✅ Retourner un tableau vide
      }
      const data = await response.json();
      // ✅ S'assurer que c'est un tableau
      return Array.isArray(data) ? data : (data.categories || []);
    } catch (error) {
      console.error('getCategories error:', error);
      return []; // ✅ Toujours retourner un tableau
    }
  },

  async getTags() {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/tags`);
      if (!response.ok) {
        console.warn('Failed to fetch tags');
        return []; // ✅ Retourner un tableau vide
      }
      const data = await response.json();
      // ✅ S'assurer que c'est un tableau
      return Array.isArray(data) ? data : (data.tags || []);
    } catch (error) {
      console.error('getTags error:', error);
      return []; // ✅ Toujours retourner un tableau
    }
  },

  // Search
  async searchArticles(query, limit = 20) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/blog/articles/search?q=${encodeURIComponent(query)}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      return {
        articles: Array.isArray(data) ? data : (data.articles || []),
        total: data.total || 0
      };
    } catch (error) {
      console.error('searchArticles error:', error);
      return { articles: [], total: 0 };
    }
  }
};