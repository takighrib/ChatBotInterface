from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from mongo import db
from routes.auth import get_current_user

router = APIRouter()

# ============ MODÈLES ============
class ArticleCreate(BaseModel):
    title: str
    content: str
    tags: List[str] = []
    category: str = "general"
    links: List[str] = []

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    category: Optional[str] = None
    links: Optional[List[str]] = None

class ArticleResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str
    author_email: str
    tags: List[str]
    category: str
    links: List[str]
    likes: int
    views: int
    created_at: str
    updated_at: str

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    content: str
    author_id: str
    author_email: str
    created_at: str

# ============ ARTICLES ============

@router.post("/articles", response_model=ArticleResponse, tags=["Blog"])
async def create_article(
    article: ArticleCreate,
    current_user: dict = Depends(get_current_user)
):
    """Créer un nouvel article"""
    article_data = {
        "title": article.title,
        "content": article.content,
        "author_id": str(current_user["_id"]),
        "author_email": current_user["email"],
        "tags": article.tags,
        "category": article.category,
        "links": article.links,
        "likes": 0,
        "views": 0,
        "comments": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = db["articles"].insert_one(article_data)
    article_data["_id"] = str(result.inserted_id)
    
    return {
        "id": article_data["_id"],
        "title": article_data["title"],
        "content": article_data["content"],
        "author_id": article_data["author_id"],
        "author_email": article_data["author_email"],
        "tags": article_data["tags"],
        "category": article_data["category"],
        "links": article_data["links"],
        "likes": article_data["likes"],
        "views": article_data["views"],
        "created_at": article_data["created_at"].isoformat(),
        "updated_at": article_data["updated_at"].isoformat()
    }

@router.get("/articles", tags=["Blog"])
async def list_articles(
    category: Optional[str] = None,
    tag: Optional[str] = None,
    limit: int = 20,
    skip: int = 0
):
    """Lister tous les articles avec filtres optionnels"""
    query = {}
    
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    
    articles = list(
        db["articles"]
        .find(query)
        .sort("created_at", -1)
        .skip(skip)
        .limit(limit)
    )
    
    for article in articles:
        article["id"] = str(article.pop("_id"))
        article["created_at"] = article["created_at"].isoformat()
        article["updated_at"] = article["updated_at"].isoformat()
    
    return articles

@router.get("/articles/{article_id}", tags=["Blog"])
async def get_article(article_id: str):
    """Récupérer un article spécifique et incrémenter les vues"""
    article = db["articles"].find_one({"_id": ObjectId(article_id)})
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Incrémenter les vues
    db["articles"].update_one(
        {"_id": ObjectId(article_id)},
        {"$inc": {"views": 1}}
    )
    
    article["id"] = str(article.pop("_id"))
    article["views"] += 1
    article["created_at"] = article["created_at"].isoformat()
    article["updated_at"] = article["updated_at"].isoformat()
    
    return article

@router.put("/articles/{article_id}", tags=["Blog"])
async def update_article(
    article_id: str,
    article_update: ArticleUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Modifier un article (seulement par l'auteur)"""
    article = db["articles"].find_one({"_id": ObjectId(article_id)})
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if article["author_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {
        k: v for k, v in article_update.dict().items() 
        if v is not None
    }
    update_data["updated_at"] = datetime.utcnow()
    
    db["articles"].update_one(
        {"_id": ObjectId(article_id)},
        {"$set": update_data}
    )
    
    return {"message": "Article updated successfully"}

@router.delete("/articles/{article_id}", tags=["Blog"])
async def delete_article(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Supprimer un article (seulement par l'auteur)"""
    article = db["articles"].find_one({"_id": ObjectId(article_id)})
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if article["author_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db["articles"].delete_one({"_id": ObjectId(article_id)})
    
    return {"message": "Article deleted successfully"}

# ============ LIKES ============

@router.post("/articles/{article_id}/like", tags=["Blog"])
async def like_article(
    article_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Liker un article"""
    user_id = str(current_user["_id"])
    
    # Vérifier si déjà liké
    article = db["articles"].find_one({"_id": ObjectId(article_id)})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    likes_collection = db["article_likes"]
    existing_like = likes_collection.find_one({
        "article_id": article_id,
        "user_id": user_id
    })
    
    if existing_like:
        # Unlike
        likes_collection.delete_one({"_id": existing_like["_id"]})
        db["articles"].update_one(
            {"_id": ObjectId(article_id)},
            {"$inc": {"likes": -1}}
        )
        return {"message": "Article unliked", "liked": False}
    else:
        # Like
        likes_collection.insert_one({
            "article_id": article_id,
            "user_id": user_id,
            "created_at": datetime.utcnow()
        })
        db["articles"].update_one(
            {"_id": ObjectId(article_id)},
            {"$inc": {"likes": 1}}
        )
        return {"message": "Article liked", "liked": True}

# ============ COMMENTAIRES ============

@router.post("/articles/{article_id}/comments", tags=["Blog"])
async def add_comment(
    article_id: str,
    comment: CommentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Ajouter un commentaire"""
    article = db["articles"].find_one({"_id": ObjectId(article_id)})
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    comment_data = {
        "_id": str(ObjectId()),
        "content": comment.content,
        "author_id": str(current_user["_id"]),
        "author_email": current_user["email"],
        "created_at": datetime.utcnow()
    }
    
    db["articles"].update_one(
        {"_id": ObjectId(article_id)},
        {"$push": {"comments": comment_data}}
    )
    
    return {
        "id": comment_data["_id"],
        "content": comment_data["content"],
        "author_id": comment_data["author_id"],
        "author_email": comment_data["author_email"],
        "created_at": comment_data["created_at"].isoformat()
    }

@router.get("/articles/{article_id}/comments", tags=["Blog"])
async def get_comments(article_id: str):
    """Récupérer tous les commentaires d'un article"""
    article = db["articles"].find_one({"_id": ObjectId(article_id)})
    
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    comments = article.get("comments", [])
    for comment in comments:
        comment["id"] = comment.pop("_id")
        comment["created_at"] = comment["created_at"].isoformat()
    
    return comments

# ============ CATÉGORIES ET TAGS ============

@router.get("/categories", tags=["Blog"])
async def get_categories():
    """Récupérer toutes les catégories"""
    categories = db["articles"].distinct("category")
    return {"categories": categories}

@router.get("/tags", tags=["Blog"])
async def get_tags():
    """Récupérer tous les tags"""
    tags = db["articles"].distinct("tags")
    return {"tags": tags}

# ============ RECHERCHE ============

@router.get("/articles/search", tags=["Blog"])
async def search_articles(q: str, limit: int = 20):
    """Rechercher des articles"""
    articles = list(
        db["articles"]
        .find({
            "$or": [
                {"title": {"$regex": q, "$options": "i"}},
                {"content": {"$regex": q, "$options": "i"}},
                {"tags": {"$regex": q, "$options": "i"}}
            ]
        })
        .sort("created_at", -1)
        .limit(limit)
    )
    
    for article in articles:
        article["id"] = str(article.pop("_id"))
        article["created_at"] = article["created_at"].isoformat()
        article["updated_at"] = article["updated_at"].isoformat()
    
    return articles

