import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <header className="nav-bar">
      <div className="nav-brand">Pixiv Feed</div>
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Home
        </NavLink>
        <NavLink to="/artists" className={({ isActive }) => isActive ? 'active' : ''}>
          Artists List
        </NavLink>
        <NavLink to="/add-artist" className={({ isActive }) => isActive ? 'active' : ''}>
          Add Artist
        </NavLink>
      </nav>
    </header>
  );
};

export default NavBar;
