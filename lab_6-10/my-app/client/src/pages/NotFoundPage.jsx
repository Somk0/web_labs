import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const NotFoundPage = () => {
  const location = useLocation();

  
  
  console.log("a")

  return (
    <div className="block">
      <div className="block-title">404 — Сторінку не знайдено</div>
      <div className="block-text">
        Адреса <b>{location.pathname}</b> не існує.
      </div>

      <Link to="/">
        <button className="btn-primary" style={{ marginTop: 10 }}>
          На головну
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
