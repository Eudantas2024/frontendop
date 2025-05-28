import React from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBuilding, FaPlusCircle, FaCog, FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaCommentDots, FaChartBar, FaBullhorn } from 'react-icons/fa';

const Header = ({ userType, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  return (

    <nav style={{ backgroundColor: '#003366', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {/* Logo */}

      <Link to="/" className="logo-link">

        <img className='logoopina'
          src="./public/logo6.svg"
          alt="Opina+ Logo"
        />
      </Link>


      <div>
        {/* Corrigido: link leva para /reclamacoes */}
        <Link to="/" style={linkStyle}><FaHome /> Início</Link>
        <Link to="/reclamacoes" style={linkStyle}><FaBullhorn />Feedbacks</Link>


        {!userType ? (
          <>
            <Link to="/login" style={linkStyle}><FaSignInAlt /> Login</Link>
            <Link to="/cadastro" style={linkStyle}><FaUserPlus /> Cadastro</Link>
            <Link to="/PainelAdmin" style={linkStyle}><FaCog />Admin</Link>
          </>

        ) : (
          <>
            {userType === 'cliente' && (
              <>
                <Link to="/novo-feedback" style={linkStyle}><FaPlusCircle /> Novo Feedback</Link>
                <Link to="/meus-feedbacks" style={linkStyle}><FaCommentDots /> Meus Feedbacks</Link>
              </>
            )}
            {userType === 'empresa' && (
              <Link to="/painel-empresa" style={linkStyle}><FaChartBar /> Painel da Empresa</Link>
            )}
            <button onClick={handleLogoutClick} style={buttonStyle}><FaSignOutAlt /> Sair</button>
          </>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  margin: '0 15px',
  padding: '5px 0',
  transition: 'color 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px'
};

const buttonStyle = {
  background: 'none',
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  marginLeft: '15px',
  fontSize: '1em',
  transition: 'color 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '5px'
};

export default Header;
