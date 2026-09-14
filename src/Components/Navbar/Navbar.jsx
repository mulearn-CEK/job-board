import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineBriefcase } from "react-icons/hi2";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <HiOutlineBriefcase className="navbar-brand-icon" />
          <span>Kerala IT Park Jobs</span>
        </Link>
        <nav className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/jobs">All Jobs</Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
