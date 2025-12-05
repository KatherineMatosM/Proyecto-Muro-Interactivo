// src/components/Posts/PostCard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toggleLike, addComment, sharePost, deletePost } from '../../services/postService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart as faHeartSolid,
  faComment,
  faShare,
  faEllipsisV,
  faPaperPlane,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import './Posts.css';

const PostCard = ({ post, index, onDelete, onUpdate }) => {
  const { currentUser, userData } = useAuth();
  const [likes, setLikes] = useState(post.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [shares, setShares] = useState(post.shares || 0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (currentUser && post.likes) {
      setHasLiked(post.likes.includes(currentUser.uid));
    }
  }, [currentUser, post.likes]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const getGradientClass = (index) => {
    const gradients = ['cyan-gradient', 'lime-gradient', 'pink-gradient', 'blue-gradient'];
    return gradients[index % gradients.length];
  };

  const handleLike = async () => {
    if (!currentUser) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    const result = await toggleLike(post.id, currentUser.uid);
    
    if (result.success) {
      setHasLiked(result.hasLiked);
      setLikes(result.hasLiked ? likes + 1 : likes - 1);
      
      // Notificar al padre para actualizar
      if (onUpdate) {
        onUpdate();
      }
    } else {
      alert(result.error || 'Error al procesar el like');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Debes iniciar sesión para comentar');
      return;
    }

    if (!commentText.trim()) return;

    const result = await addComment(
      post.id,
      currentUser.uid,
      `${userData.nombre} ${userData.apellido}`,
      commentText
    );
    
    if (result.success) {
      setComments([...comments, result.comment]);
      setCommentText('');
      
      // Notificar al padre para actualizar
      if (onUpdate) {
        onUpdate();
      }
    } else {
      alert(result.error || 'Error al agregar comentario');
    }
  };

  const handleShare = async () => {
    const result = await sharePost(post.id);
    
    if (result.success) {
      setShares(shares + 1);
      
      // Copiar link al portapapeles
      const url = `${window.location.origin}/post/${post.id}`;
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          alert('¡Link copiado al portapapeles!');
        }).catch(() => {
          alert('Post compartido exitosamente');
        });
      } else {
        alert('Post compartido exitosamente');
      }
      
      // Notificar al padre para actualizar
      if (onUpdate) {
        onUpdate();
      }
    } else {
      alert(result.error || 'Error al compartir');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    const result = await deletePost(post.id, currentUser.uid);
    
    if (result.success) {
      alert('Publicación eliminada exitosamente');
      if (onDelete) {
        onDelete(post.id);
      }
    } else {
      alert(result.error || 'Error al eliminar la publicación');
    }
  };

  const isOwnPost = currentUser && post.authorId === currentUser.uid;

  return (
    <div className="post-card">
      <div className="post-content">
        <div className={`post-avatar ${getGradientClass(index)}`}>
          {post.authorName ? post.authorName.split(' ').map(n => n[0]).join('') : '?'}
        </div>

        <div className="post-body">
          <div className="post-header">
            <div className="post-author">
              <h3>{post.authorName}</h3>
              <p className="post-meta">
                <span>@{post.authorUsername}</span>
                <span className="dot">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </p>
            </div>
            {isOwnPost && (
              <div className="post-menu">
                <button 
                  className="more-button"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
                {showMenu && (
                  <div className="post-menu-dropdown">
                    <button onClick={handleDelete} className="menu-item danger">
                      <FontAwesomeIcon icon={faTrash} />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="post-text">{post.content}</p>

          <div className="post-actions">
            <button 
              className={`action-btn like-btn ${hasLiked ? 'active' : ''}`}
              onClick={handleLike}
            >
              <FontAwesomeIcon icon={hasLiked ? faHeartSolid : faHeartRegular} />
              <span>{likes}</span>
            </button>
            
            <button 
              className={`action-btn comment-btn ${showComments ? 'active' : ''}`}
              onClick={() => setShowComments(!showComments)}
            >
              <FontAwesomeIcon icon={faComment} />
              <span>{comments.length}</span>
            </button>
            
            <button 
              className="action-btn share-btn"
              onClick={handleShare}
            >
              <FontAwesomeIcon icon={faShare} />
              <span>{shares}</span>
            </button>
          </div>

          {showComments && (
            <div className="comments-section">
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="no-comments">No hay comentarios aún. ¡Sé el primero!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar cyan-gradient">
                        {comment.userName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="comment-body">
                        <p className="comment-author">{comment.userName}</p>
                        <p className="comment-text">{comment.content}</p>
                        <p className="comment-date">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {currentUser && (
                <form onSubmit={handleComment} className="comment-form">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="comment-input"
                  />
                  <button 
                    type="submit" 
                    className="comment-submit"
                    disabled={!commentText.trim()}
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;