// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLock, 
  faArrowLeft,
  faArrowRightToBracket 
} from '@fortawesome/free-solid-svg-icons';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    clave: ''
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
    setLoading(true);

    try {
      const result = await loginUser(formData.usuario, formData.clave);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon cyan-gradient">
            <FontAwesomeIcon icon={faLock} />
          </div>
          <h2>¡Hola de nuevo!</h2>
          <p>Te extrañamos por aquí</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button 
            type="submit" 
            className="btn btn-primary cyan-gradient btn-login"
            disabled={loading}
          >
            <FontAwesomeIcon icon={faArrowRightToBracket} />
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            ¿Primera vez aquí?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="link-button"
            >
              Únete gratis
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

export default Login;