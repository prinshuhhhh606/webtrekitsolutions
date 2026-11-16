import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useWebsite } from '../../context/WebsiteContext';
import './Topbar.css';

const Topbar = () => {
  const { settings } = useWebsite();

  return (
    <div className="topbar-wrapper hidden md:block">
      <div className="topbar-container">
        <div className="flex items-center gap-6">
          <div className="topbar-item">
            <MapPin className="topbar-icon" />
            <span className="truncate max-w-xs">{settings.address || '328 Patnipura, Main Road, Indore'}</span>
          </div>
          <div className="topbar-item">
            <Clock className="topbar-icon" />
            <span>{settings.businessHours || 'Mon - Sat: 9:30 AM - 6:30 PM'}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href={`tel:${settings.phone?.replace(/[^0-9+]/g, '') || '+919039811558'}`}
            className="topbar-item font-semibold"
          >
            <Phone className="topbar-icon" />
            <span>{settings.phone || '+91 9039811558'}</span>
          </a>
          <a
            href={`mailto:${settings.email || 'webtrekitsolutions@gmail.com'}`}
            className="topbar-item"
          >
            <Mail className="topbar-icon" />
            <span>{settings.email || 'webtrekitsolutions@gmail.com'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
