import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← Ajouter
import { blogService } from "@services/api/blogService";
import { useAuth } from "@context/AuthContext"; // ← Ajouter
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import TextArea from "@components/common/TextArea";
import Notification from "@components/common/Notification";

const BlogCreatePage = () => {
  const { user } = useAuth(); // ← Récupérer l'utilisateur
  const navigate = useNavigate(); // ← Pour redirection
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false); // ← Ajouter état loading

  const handleSubmit = async () => {
    // ✅ Récupérer le token depuis localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      setMessage({ type: "error", text: "Vous devez être connecté pour créer un article" });
      return;
    }

    try {
      setLoading(true);
      
      // ✅ PASSER LE TOKEN en second paramètre
      await blogService.createArticle({
        title,
        content,
        image_url: imageUrl,
        tags: [], // ← Ajouter si nécessaire
        category: "general" // ← Ajouter si nécessaire
      }, token);

      setMessage({ type: "success", text: "Article créé avec succès !" });
      
      // Réinitialiser le formulaire
      setTitle("");
      setContent("");
      setImageUrl("");
      
      // ✅ Rediriger vers la page blog après 2 secondes
      setTimeout(() => {
        navigate('/blog');
      }, 2000);
      
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Erreur lors de la création" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Créer un article</h1>

      {message && (
        <Notification
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      <Input
        label="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4"
        required
      />

      <Input
        label="Image URL (optionnel)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="mb-4"
        placeholder="https://example.com/image.jpg"
      />

      <TextArea
        label="Contenu"
        value={content}
        rows={12}
        onChange={(e) => setContent(e.target.value)}
        className="mb-6"
        required
      />

      <Button 
        onClick={handleSubmit}
        disabled={loading || !title || !content}
      >
        {loading ? "Publication..." : "Publier l'article"}
      </Button>
    </div>
  );
};

export default BlogCreatePage;