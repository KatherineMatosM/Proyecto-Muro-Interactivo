// src/components/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import { validateRegisterForm } from '../../utils/validators';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, 
  faArrowLeft,
  faCheck 
} from '@fortawesome/free-solid-svg-icons';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    clave: '',
    confirmarClave: '',
    nombre: '',
    apellido: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar formulario
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(formData);
      
      if (result.success) {
        alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon lime-gradient">
            <FontAwesomeIcon icon={faUserPlus} />
          </div>
          <h2>¡Bienvenido!</h2>
          <p>Únete a nuestra comunidad</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Apellido"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Usuario"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmarClave"
              value={formData.confirmarClave}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary lime-gradient btn-register"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faCheck} />
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="link-button"
            >
              Inicia sesión
            </button>
          </p>
          <button
            onClick={() => navigate('/')}
            className="back-link"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;