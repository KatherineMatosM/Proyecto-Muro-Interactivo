// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import { getAllPosts } from '../services/postService';

/**
 * Hook personalizado para manejar posts
 */
export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    const result = await getAllPosts();
    
    if (result.success) {
      setPosts(result.posts);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const refreshPosts = () => {
    loadPosts();
  };

  return {
    posts,
    loading,
    error,
    refreshPosts,
    setPosts
  };
};

export default usePosts;