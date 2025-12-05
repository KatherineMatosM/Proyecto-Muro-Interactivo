// src/components/Layout/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logoutUser } from '../../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faArrowRightToBracket, 
  faUserPlus, 
  faArrowRightFromBracket,
  faUser,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <button onClick={() => navigate('/')} className="logo-button">
          <div className="logo-icon">
            <FontAwesomeIcon icon={faComments} />
            <div className="ping"></div>
          </div>
          <div className="logo-text">
            <h1>SocialHub</h1>
            <p>Conecta con el mundo</p>
          </div>
        </button>

        <nav className="header-nav">
          {currentUser && userData ? (
            <>
              <button 
                onClick={() => navigate('/profile')}
                className="user-badge"
              >
                <div className="user-avatar cyan-gradient">
                  {userData.nombre[0]}{userData.apellido[0]}
                </div>
                <div className="user-info">
                  <p className="user-name">{userData.nombre}</p>
                  <p className="user-username">@{userData.usuario}</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/create')}
                className="btn btn-primary pink-gradient"
              >
                <FontAwesomeIcon icon={faPlus} />
                Publicar
              </button>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                Salir
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="btn btn-primary cyan-gradient"
              >
                <FontAwesomeIcon icon={faArrowRightToBracket} />
                Ingresar
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="btn btn-primary lime-gradient"
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Únete
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;