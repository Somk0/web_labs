import React from "react";
import { NavLink, useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();

  const isCatalog = location.pathname.startsWith("/catalog");

  return (
    <header>
      <div className="header-topbar">Home page</div>
      <div className="header-main">
        <div className="logo-box">LOGO</div>
        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "nav-tab " +
              (isActive ? "nav-tab-active" : "")
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              "nav-tab " +
              (isActive ? "nav-tab-active" : "")
            }
          >
            Catalog
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              "nav-tab " +
              (isActive ? "nav-tab-active" : "")
            }
          >
            Cart
          </NavLink>
        </nav>
        {isCatalog && (
          <input
            type="text"
            disabled
            value=""
            placeholder="Search..."
            className="header-search"
          />
        )}
      </div>
      <div className="header-divider" />
    </header>
  );
}

export default Header;
