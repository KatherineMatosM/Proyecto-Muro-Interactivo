// src/components/Posts/CreatePost.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createPost } from '../../services/postService';
import { validatePostContent } from '../../utils/validators';
import './Posts.css';

const CreatePost = ({ onPostCreated }) => {
  const { userData } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Verificar si userData está disponible
  if (!userData) {
    return (
      <div className="create-post">
        <div className="create-post-header">
          <div className="create-post-avatar pink-gradient">
            ??
          </div>
          <div>
            <h3>Crear Publicación</h3>
            <p>Inicia sesión para publicar contenido</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validatePostContent(content);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await createPost(content, userData);

      if (result.success) {
        setContent('');
        setSuccess('✨ ¡Post publicado exitosamente!');

        if (onPostCreated) {
          onPostCreated(result.post);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al publicar el post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="create-post-avatar pink-gradient">
          {userData.nombre?.[0]}{userData.apellido?.[0]}
        </div>
        <div>
          <h3>Crear Publicación</h3>
          <p>Comparte algo increíble</p>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué está pasando? Comparte tus pensamientos con el mundo..."
          rows="5"
          className="create-post-textarea"
        />

        <div className="create-post-footer">
          <span className="char-count">{content.length} / 500 caracteres</span>

          <button
            type="submit"
            className="btn btn-primary pink-gradient"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
