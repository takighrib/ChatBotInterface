import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogService } from "@services/api/blogService";
import Button from "@components/common/Button";
import Input from "@components/common/Input";
import TextArea from "@components/common/TextArea";
import Notification from "@components/common/Notification";
import { ArrowLeft, Loader } from "lucide-react";

const BlogCreatePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage({
        type: "error",
        text: "Vous devez être connecté pour créer un article",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      setMessage({
        type: "error",
        text: "Le titre et le contenu sont requis",
      });
      return;
    }

    try {
      setLoading(true);

      const articleData = {
        title: title.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        image_url: imageUrl.trim(),
        links: [],
      };

      await blogService.createArticle(articleData, token);

      setMessage({ type: "success", text: "Article créé avec succès !" });

      setTimeout(() => {
        navigate("/blog");
      }, 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Erreur lors de la création",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Button
          variant="outline"
          icon={<ArrowLeft />}
          onClick={() => navigate("/blog")}
          className="mb-6"
        >
          Retour
        </Button>

        <h1 className="text-3xl font-bold mb-6">Créer un article</h1>

        {message && (
          <Notification
            type={message.type}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de votre article"
            required
          />

          <Input
            label="Catégorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: IA, Programmation, Data Science"
          />

          <Input
            label="Tags (séparés par des virgules)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Ex: Machine Learning, Python, Tutorial"
          />

          <Input
            label="Image URL (optionnel)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />

          <TextArea
            label="Contenu"
            value={content}
            rows={15}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Rédigez le contenu de votre article..."
            required
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              icon={loading ? <Loader className="animate-spin" /> : null}
            >
              {loading ? "Publication..." : "Publier l'article"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/blog")}
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreatePage;