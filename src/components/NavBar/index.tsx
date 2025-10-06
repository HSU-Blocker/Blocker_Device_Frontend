import React from 'react';
import { Link } from 'react-router-dom';
import { useSetShowAnimation } from '../../store';
// import styles from './NavBar.module.css';

const NavBar: React.FC = () => {
  const setShowAnimation = useSetShowAnimation();

  const handleHelpClick = () => {
    setShowAnimation(true);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <Link
          to="/"
          className="logoLink"
          style={{ fontSize: 30, fontWeight: 'bold' }}
          onMouseOver={e => e.currentTarget.style.color = '#000'}
          onMouseOut={e => e.currentTarget.style.color = '#000'}
        >
          Blocker
        </Link>
      </div>
      <div className="navLinks">
        <Link to="/" className="navLink">Home</Link>
        <Link to="/history" className="navLink">History</Link>
        <div className="flex items-center gap-6">
          <button
            className="helpBtn"
            onClick={handleHelpClick}
          >
            Help
          </button>
          {/* <button className="settingsBtn">
            ⚙️
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;