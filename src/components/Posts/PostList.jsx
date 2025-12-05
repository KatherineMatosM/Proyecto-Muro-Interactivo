// src/components/Posts/PostList.jsx
import React, { useState, useEffect } from 'react';
import { getAllPosts } from '../../services/postService';
import PostCard from './PostCard';
import './Posts.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const result = await getAllPosts();
    
    if (result.success) {
      setPosts(result.posts);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handlePostUpdate = () => {
    // Recargar posts cuando haya actualizaciones (likes, comentarios, shares)
    loadPosts();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ {error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">💬</div>
        <h3>¡Sé el primero!</h3>
        <p>Aún no hay publicaciones. Crea tu cuenta y comparte algo increíble con la comunidad ✨</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.map((post, index) => (
        <PostCard 
          key={post.id} 
          post={post} 
          index={index}
          onDelete={handlePostDelete}
          onUpdate={handlePostUpdate}
        />
      ))}
    </div>
  );
};

export default PostList;