import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { blogService } from "@services/api/blogService";
import LoadingSpinner from "@components/common/LoadingSpinner";
import Notification from "@components/common/Notification";
import Button from "@components/common/Button";
import Card from "@components/common/Card";
import TextArea from "@components/common/TextArea";
import Badge from "@components/common/Badge";
import {
  Calendar,
  User,
  Heart,
  MessageCircle,
  Eye,
  ArrowLeft,
  Send,
  Tag
} from "lucide-react";
import { formatDate } from "@utils/dateFormatter";

const BlogArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const data = await blogService.getArticle(id);
      setArticle(data);
      setLikesCount(data.likes || 0);

      const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");
      setIsLiked(likedArticles.includes(id));
    } catch (err) {
      setError("Article introuvable");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await blogService.getComments(id);
      setComments(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires:", err);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour aimer un article");
      return;
    }

    if (likingInProgress) return;

    try {
      setLikingInProgress(true);
      const response = await blogService.toggleLike(id, token);

      setIsLiked(response.liked);
      setLikesCount((prev) => (response.liked ? prev + 1 : prev - 1));

      const likedArticles = JSON.parse(localStorage.getItem("likedArticles") || "[]");

      if (response.liked) {
        likedArticles.push(id);
      } else {
        const index = likedArticles.indexOf(id);
        if (index > -1) likedArticles.splice(index, 1);
      }

      localStorage.setItem("likedArticles", JSON.stringify(likedArticles));
    } catch (err) {
      setError(err.message || "Erreur lors du like");
    } finally {
      setLikingInProgress(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setError("Vous devez être connecté pour commenter");
      return;
    }

    if (!newComment.trim()) {
      setError("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      setSubmittingComment(true);
      const comment = await blogService.addComment(id, newComment, token);

      setComments([...comments, comment]);
      setNewComment("");
      setSuccess("Commentaire ajouté avec succès !");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || "Erreur lors de l'ajout du commentaire");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && !article) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Notification
          type="error"
          message={error}
          onClose={() => navigate("/blog")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {error && (
          <Notification type="error" message={error} onClose={() => setError(null)} />
        )}

        {success && (
          <Notification
            type="success"
            message={success}
            onClose={() => setSuccess(null)}
          />
        )}

        <Button
          variant="outline"
          icon={<ArrowLeft />}
          onClick={() => navigate("/blog")}
          className="mb-6"
        >
          Retour au blog
        </Button>

        <Card className="mb-8">
          {article.image_url && (
            <div className="relative h-96 w-full overflow-hidden rounded-t-lg">
              <img
                src={article.image_url}
                className="w-full h-full object-cover"
                alt={article.title}
              />
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {article.category && <Badge variant="primary">{article.category}</Badge>}

              {article.tags?.map((tag, index) => (
                <Badge key={index} variant="outline">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{article.author_email}</span>
              </span>

              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(article.created_at)}
              </span>

              <span className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                {article.views || 0} vues
              </span>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">
                {article.content}
              </p>
            </div>

            {article.links && article.links.length > 0 && (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Liens utiles :</h3>
                <ul className="space-y-2">
                  {article.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center gap-4 pt-6 border-t">
              <Button
                variant={isLiked ? "primary" : "outline"}
                icon={<Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />}
                onClick={handleLike}
                disabled={likingInProgress || !isAuthenticated}
                className="transition-all"
              >
                {isLiked ? "Aimé" : "Aimer"} ({likesCount})
              </Button>

              <span className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                {comments.length} commentaire{comments.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6" />
              Commentaires ({comments.length})
            </h2>

            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <TextArea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrivez votre commentaire..."
                  rows={4}
                  className="mb-4"
                />

                <Button
                  type="submit"
                  icon={<Send />}
                  disabled={submittingComment || !newComment.trim()}
                >
                  {submittingComment ? "Envoi..." : "Envoyer"}
                </Button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg text-center">
                <p className="text-gray-700 mb-3">Connectez-vous pour laisser un commentaire</p>
                <Button onClick={() => navigate("/login")}>Se connecter</Button>
              </div>
            )}

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </p>
              ) : (
                comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const CommentCard = ({ comment }) => (
  <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {comment.author_email?.[0]?.toUpperCase() || "U"}
        </div>
        <div>
          <p className="font-medium text-gray-900">{comment.author_email}</p>
          <p className="text-sm text-gray-500">{formatDate(comment.created_at)}</p>
        </div>
      </div>
    </div>

    <p className="text-gray-700 ml-10">{comment.content}</p>
  </div>
);

export default BlogArticlePage;
