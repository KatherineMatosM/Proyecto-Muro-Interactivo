// src/components/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserPosts, deletePost } from '../../services/postService';
import { deleteUserAccount } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faTrash, 
  faExclamationTriangle,
  faArrowLeft,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadUserPosts();
    }
  }, [currentUser]);

  const loadUserPosts = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    const result = await getUserPosts(currentUser.uid);
    
    if (result.success) {
      setPosts(result.posts);
    } else {
      console.error('Error cargando posts:', result.error);
    }
    
    setLoading(false);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    const result = await deletePost(postId, currentUser.uid);
    
    if (result.success) {
      setPosts(posts.filter(post => post.id !== postId));
      alert('Publicación eliminada exitosamente');
    } else {
      alert(result.error || 'Error al eliminar la publicación');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'ELIMINAR') {
      alert('Por favor escribe ELIMINAR para confirmar');
      return;
    }

    const result = await deleteUserAccount(currentUser.uid);
    
    if (result.success) {
      alert('Tu cuenta ha sido eliminada');
      navigate('/');
    } else {
      alert(result.error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradientClass = (index) => {
    const gradients = ['cyan-gradient', 'lime-gradient', 'pink-gradient', 'blue-gradient'];
    return gradients[index % gradients.length];
  };

  // Calcular total de likes recibidos
  const totalLikes = posts.reduce((acc, post) => acc + (post.likesCount || 0), 0);

  if (!currentUser || !userData) {
    return (
      <div className="profile-container">
        <div className="error-message">
          Debes iniciar sesión para ver tu perfil
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <button onClick={() => navigate('/')} className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} />
        Volver al inicio
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar cyan-gradient">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="profile-info">
            <h1>{userData.nombre} {userData.apellido}</h1>
            <p className="profile-username">@{userData.usuario}</p>
            <p className="profile-joined">
              <FontAwesomeIcon icon={faCalendar} />
              Se unió el {formatDate(userData.createdAt)}
            </p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Publicaciones</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{totalLikes}</span>
            <span className="stat-label">Likes recibidos</span>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            onClick={() => setShowDeleteModal(true)}
            className="btn-delete-account"
          >
            <FontAwesomeIcon icon={faTrash} />
            Eliminar cuenta
          </button>
        </div>
      </div>

      <div className="user-posts-section">
        <h2>Mis Publicaciones</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando publicaciones...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>Aún no has publicado nada</p>
          </div>
        ) : (
          <div className="post-list">
            {posts.map((post, index) => (
              <div key={post.id} className="profile-post-card">
                <div className="post-content">
                  <div className={`post-avatar ${getGradientClass(index)}`}>
                    {userData.nombre[0]}{userData.apellido[0]}
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
                    </div>

                    <p className="post-text">{post.content}</p>

                    <div className="post-stats">
                      <span>❤️ {post.likesCount || 0} likes</span>
                      <span>💬 {post.commentsCount || 0} comentarios</span>
                      <span>🔗 {post.shares || 0} compartidos</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="btn-delete-post"
                  title="Eliminar publicación"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header danger">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              <h3>Eliminar Cuenta</h3>
            </div>
            <div className="modal-body">
              <p>
                <strong>¡Advertencia!</strong> Esta acción es permanente y no se puede deshacer.
              </p>
              <p>Se eliminarán:</p>
              <ul>
                <li>Tu perfil y datos personales</li>
                <li>Todas tus publicaciones ({posts.length})</li>
                <li>Todos tus comentarios y likes</li>
              </ul>
              <p>Para confirmar, escribe <strong>ELIMINAR</strong> a continuación:</p>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Escribe ELIMINAR"
                className="confirmation-input"
              />
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger"
                disabled={deleteConfirmation !== 'ELIMINAR'}
              >
                <FontAwesomeIcon icon={faTrash} />
                Eliminar mi cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;