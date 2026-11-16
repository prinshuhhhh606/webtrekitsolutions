import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="notfound-wrapper">
      <div className="notfound-card">
        <div className="notfound-digit">
          4<span>0</span>4
        </div>
        <h2 className="notfound-title">
          Page Not Found
        </h2>
        <p className="notfound-desc">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <Link to="/" className="notfound-btn">
          <Home className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

