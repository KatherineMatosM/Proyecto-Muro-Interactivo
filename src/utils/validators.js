// src/utils/validators.js

/**
 * Validar que un campo no esté vacío
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} es requerido`;
  }
  return null;
};

/**
 * Validar nombre de usuario
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'El usuario es requerido';
  }
  
  if (username.length < 3) {
    return 'El usuario debe tener al menos 3 caracteres';
  }
  
  if (username.length > 20) {
    return 'El usuario no puede tener más de 20 caracteres';
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'El usuario solo puede contener letras, números y guiones bajos';
  }
  
  return null;
};

/**
 * Validar contraseña
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'La contraseña es requerida';
  }
  
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  return null;
};

/**
 * Validar que las contraseñas coincidan
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Las contraseñas no coinciden';
  }
  return null;
};

/**
 * Validar contenido de post
 */
export const validatePostContent = (content) => {
  if (!content || content.trim() === '') {
    return 'El contenido del post no puede estar vacío';
  }
  
  if (content.length > 500) {
    return 'El post no puede tener más de 500 caracteres';
  }
  
  return null;
};

/**
 * Validar formulario de registro completo
 */
export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const usernameError = validateUsername(formData.usuario);
  if (usernameError) errors.usuario = usernameError;
  
  const passwordError = validatePassword(formData.clave);
  if (passwordError) errors.clave = passwordError;
  
  const nombreError = validateRequired(formData.nombre, 'El nombre');
  if (nombreError) errors.nombre = nombreError;
  
  const apellidoError = validateRequired(formData.apellido, 'El apellido');
  if (apellidoError) errors.apellido = apellidoError;
  
  if (formData.confirmarClave) {
    const matchError = validatePasswordMatch(formData.clave, formData.confirmarClave);
    if (matchError) errors.confirmarClave = matchError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validar formulario de login
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const usernameError = validateRequired(formData.usuario, 'El usuario');
  if (usernameError) errors.usuario = usernameError;
  
  const passwordError = validateRequired(formData.clave, 'La contraseña');
  if (passwordError) errors.clave = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};