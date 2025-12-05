// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Registrar nuevo usuario
 */
export const registerUser = async (userData) => {
  const { usuario, clave, nombre, apellido } = userData;
  
  try {
    const email = `${usuario}@murointeractivo.com`;
    const userCredential = await createUserWithEmailAndPassword(auth, email, clave);
    const user = userCredential.user;
    
    await updateProfile(user, {
      displayName: `${nombre} ${apellido}`
    });
    
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      usuario,
      nombre,
      apellido,
      createdAt: new Date().toISOString()
    });
    
    return {
      success: true,
      user: { uid: user.uid, usuario, nombre, apellido }
    };
  } catch (error) {
    console.error('Error en registro:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

/**
 * Iniciar sesión
 */
export const loginUser = async (usuario, clave) => {
  try {
    const email = `${usuario}@murointeractivo.com`;
    const userCredential = await signInWithEmailAndPassword(auth, email, clave);
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      error: getErrorMessage(error.code)
    };
  }
};

/**
 * Cerrar sesión
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return {
      success: false,
      error: 'Error al cerrar sesión'
    };
  }
};

/**
 * Eliminar cuenta de usuario
 */
export const deleteUserAccount = async (userId) => {
  try {
    const user = auth.currentUser;
    
    if (!user || user.uid !== userId) {
      return {
        success: false,
        error: 'No tienes permiso para eliminar esta cuenta'
      };
    }
    
    await deleteDoc(doc(db, 'users', userId));
    
    await deleteUser(user);
    
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    return {
      success: false,
      error: 'Error al eliminar la cuenta. Por favor, vuelve a iniciar sesión e intenta nuevamente.'
    };
  }
};

const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'El usuario ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Usuario deshabilitado',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/invalid-credential': 'Credenciales inválidas'
  };
  
  return errorMessages[errorCode] || 'Error de autenticación';
};