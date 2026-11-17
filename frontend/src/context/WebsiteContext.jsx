import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../services/api';

const WebsiteContext = createContext();

export const WebsiteProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    websiteName: 'Webtrek IT Solutions',
    companyName: 'Webtrek IT Solutions',
    tagline: 'Smart Partner To Grow Your Best Business',
    phone: '+91 7496969728',
    email: 'info@webtrekitsolutions.in',
    address: '328, Patni Pura Road, Nanda Nagar, Indore, Madhya Pradesh 452011, India',
    businessHours: 'Mon - Sat: 9:30 AM - 6:30 PM',
    socialLinks: {
      facebook: 'https://facebook.com/webtrekitsolutions',
      instagram: 'https://instagram.com/webtrekitsolutions',
      linkedin: 'https://linkedin.com/company/webtrekitsolutions',
      whatsapp: 'https://wa.me/917496969728',
    },
    stats: {
      projectsCompleted: '150+',
      clientSatisfaction: '99%',
      yearsExperience: '5+',
      supportHours: '24/7',
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    service: 'Website Development',
    enquiryType: 'General',
    relatedProject: '',
    sourcePage: '',
  });

  const openEnquiryModal = (options = 'Website Development') => {
    if (typeof options === 'string') {
      setModalOptions({
        service: options || 'Website Development',
        enquiryType: 'Service',
        relatedProject: '',
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : '',
      });
    } else if (typeof options === 'object' && options !== null) {
      setModalOptions({
        service: options.service || 'Website Development',
        enquiryType: options.enquiryType || 'General',
        relatedProject: options.relatedProject || '',
        sourcePage: options.sourcePage || (typeof window !== 'undefined' ? window.location.pathname : ''),
      });
    }
    setIsModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsModalOpen(false);
  };

  const fetchSettings = async () => {
    try {
      const res = await settingsService.get();
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        const currentName = data.websiteName || data.companyName || 'Webtrek IT Solutions';
        data.websiteName = currentName;
        data.companyName = currentName;
        setSettings(data);
        if (typeof document !== 'undefined') {
          document.title = `${currentName} | Smart Partner To Grow Your Best Business`;
        }
      }
    } catch (err) {
      // Use fallback defaults gracefully if backend is loading
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const websiteName = settings.websiteName || settings.companyName || 'Webtrek IT Solutions';

  return (
    <WebsiteContext.Provider
      value={{
        settings,
        websiteName,
        refreshSettings: fetchSettings,
        isModalOpen,
        modalOptions,
        modalService: modalOptions.service,
        openEnquiryModal,
        closeEnquiryModal,
      }}
    >
      {children}
    </WebsiteContext.Provider>
  );
};

export const useWebsite = () => useContext(WebsiteContext);

