// src/services/postService.js
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  limit,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  where,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Crear un nuevo post
 */
export const createPost = async (content, user) => {
  try {
    const postData = {
      content,
      authorId: user.uid,
      authorName: `${user.nombre} ${user.apellido}`,
      authorUsername: user.usuario,
      createdAt: new Date().toISOString(),
      likes: [],
      likesCount: 0,
      comments: [],
      commentsCount: 0,
      shares: 0
    };
    
    const docRef = await addDoc(collection(db, 'posts'), postData);
    
    return {
      success: true,
      postId: docRef.id,
      post: { ...postData, id: docRef.id }
    };
  } catch (error) {
    console.error('Error al crear post:', error);
    return {
      success: false,
      error: 'Error al crear la publicación'
    };
  }
};

/**
 * Obtener todos los posts
 */
export const getAllPosts = async (limitCount = 50) => {
  try {
    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(postsQuery);
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Asegurar que estos campos existan
        likes: data.likes || [],
        likesCount: data.likesCount || 0,
        comments: data.comments || [],
        commentsCount: data.commentsCount || 0,
        shares: data.shares || 0
      };
    });
    
    return {
      success: true,
      posts
    };
  } catch (error) {
    console.error('Error al obtener posts:', error);
    return {
      success: false,
      error: 'Error al cargar las publicaciones'
    };
  }
};

/**
 * Obtener posts de un usuario específico
 */
export const getUserPosts = async (userId) => {
  try {
    console.log('🔍 Buscando posts para el usuario:', userId);
    
    // Primero intentar con orderBy
    let postsQuery = query(
      collection(db, 'posts'),
      where('authorId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    let querySnapshot;
    
    try {
      querySnapshot = await getDocs(postsQuery);
    } catch (indexError) {
      // Si falla por falta de índice, intentar sin orderBy
      console.warn('⚠️ Usando query sin orderBy (falta índice)');
      postsQuery = query(
        collection(db, 'posts'),
        where('authorId', '==', userId)
      );
      querySnapshot = await getDocs(postsQuery);
    }
    
    console.log('📊 Posts encontrados:', querySnapshot.docs.length);
    
    const posts = querySnapshot.docs.map(doc => {
      const data = doc.data();
      console.log('📄 Post:', doc.id, 'Likes:', data.likesCount);
      
      return {
        id: doc.id,
        ...data,
        likes: data.likes || [],
        likesCount: data.likesCount || 0,
        comments: data.comments || [],
        commentsCount: data.commentsCount || 0,
        shares: data.shares || 0
      };
    });
    
    // Ordenar manualmente por fecha si no se pudo hacer en la query
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('✅ Total de posts:', posts.length);
    console.log('✅ Total de likes:', posts.reduce((acc, p) => acc + p.likesCount, 0));
    
    return {
      success: true,
      posts
    };
  } catch (error) {
    console.error('❌ Error al obtener posts del usuario:', error);
    return {
      success: false,
      error: 'Error al cargar tus publicaciones',
      posts: []
    };
  }
};

/**
 * Eliminar un post
 */
export const deletePost = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      return { success: false, error: 'Post no encontrado' };
    }
    
    if (postDoc.data().authorId !== userId) {
      return { success: false, error: 'No tienes permiso para eliminar este post' };
    }
    
    await deleteDoc(postRef);
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar post:', error);
    return {
      success: false,
      error: 'Error al eliminar la publicación'
    };
  }
};

/**
 * Dar o quitar like a un post
 */
export const toggleLike = async (postId, userId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    
    if (!postDoc.exists()) {
      return { success: false, error: 'Post no encontrado' };
    }
    
    const likes = postDoc.data().likes || [];
    const hasLiked = likes.includes(userId);
    
    if (hasLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
        likesCount: increment(-1)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        likesCount: increment(1)
      });
    }
    
    return { success: true, hasLiked: !hasLiked };
  } catch (error) {
    console.error('Error al dar like:', error);
    return {
      success: false,
      error: 'Error al procesar el like'
    };
  }
};

/**
 * Agregar comentario a un post
 */
export const addComment = async (postId, userId, userName, content) => {
  try {
    const postRef = doc(db, 'posts', postId);
    
    const comment = {
      id: Date.now().toString(),
      userId,
      userName,
      content,
      createdAt: new Date().toISOString()
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(comment),
      commentsCount: increment(1)
    });
    
    return { success: true, comment };
  } catch (error) {
    console.error('Error al agregar comentario:', error);
    return {
      success: false,
      error: 'Error al agregar comentario'
    };
  }
};

/**
 * Compartir post (incrementar contador)
 */
export const sharePost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    
    await updateDoc(postRef, {
      shares: increment(1)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error al compartir post:', error);
    return {
      success: false,
      error: 'Error al compartir publicación'
    };
  }
};

/**
 * Obtener datos de un usuario
 */
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return {
        success: true,
        userData: userDoc.data()
      };
    } else {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
  } catch (error) {
    console.error('Error al obtener datos del usuario:', error);
    return {
      success: false,
      error: 'Error al cargar datos del usuario'
    };
  }
};