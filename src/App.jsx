import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PostList from './components/Posts/PostList';
import CreatePost from './components/Posts/CreatePost';
import Profile from './components/Profile/Profile';

// Componente Home
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container">
      <div className="page-header">
        <div className="header-icon lime-gradient">
          <FontAwesomeIcon icon={faArrowTrendUp} />
        </div>
        <div>
          <h2>Tendencias</h2>
          <p>Lo más popular ahora</p>
        </div>
      </div>

      {isAuthenticated && <CreatePost />}
      <PostList />
    </div>
  );
};

// Ruta protegida (requiere autenticación)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente principal de la aplicación
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;