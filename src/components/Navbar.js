import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Navbar() {
  return (
    <div>
      <nav className="navbar">
        <h1 className="nameLogo">SummerK</h1>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/favourites" className="nav-link">
              Favourites
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/analytics" className="nav-link">
              Analytics
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
