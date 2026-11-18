import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService, careersService } from '../services/api';

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
    isHiringActive: false,
    hiringStatus: 'inactive',
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
      const [settingsRes, hiringRes] = await Promise.allSettled([
        settingsService.get(),
        careersService.getStatus(),
      ]);

      let data = {};
      if (settingsRes.status === 'fulfilled' && settingsRes.value?.data?.success && settingsRes.value.data.data) {
        data = { ...settingsRes.value.data.data };
      }

      if (hiringRes.status === 'fulfilled' && hiringRes.value?.data?.success) {
        const isHiring = Boolean(hiringRes.value.data.isHiringActive);
        data.isHiringActive = isHiring;
        data.hiringStatus = isHiring ? 'active' : 'inactive';
      } else {
        data.isHiringActive = Boolean(data.isHiringActive || data.hiringStatus === 'active');
        data.hiringStatus = data.isHiringActive ? 'active' : 'inactive';
      }

      const currentName = data.websiteName || data.companyName || 'Webtrek IT Solutions';
      data.websiteName = currentName;
      data.companyName = currentName;
      setSettings((prev) => ({ ...prev, ...data }));
      if (typeof document !== 'undefined') {
        document.title = `${currentName} | Smart Partner To Grow Your Best Business`;
      }
    } catch (err) {
      // Use fallback defaults gracefully if backend is loading
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for real-time hiring status changes across tabs or admin panels
    const handleHiringUpdate = (e) => {
      const active = Boolean(e?.detail?.isHiringActive ?? (e?.detail?.hiringStatus === 'active'));
      setSettings((prev) => ({
        ...prev,
        isHiringActive: active,
        hiringStatus: active ? 'active' : 'inactive',
      }));
    };

    window.addEventListener('webtrek:hiring_status_changed', handleHiringUpdate);

    let bc;
    try {
      bc = new BroadcastChannel('webtrek_hiring_channel');
      bc.onmessage = (event) => {
        if (event.data && event.data.type === 'HIRING_STATUS_CHANGED') {
          const active = Boolean(event.data.isHiringActive);
          setSettings((prev) => ({
            ...prev,
            isHiringActive: active,
            hiringStatus: active ? 'active' : 'inactive',
          }));
        }
      };
    } catch (_) {}

    return () => {
      window.removeEventListener('webtrek:hiring_status_changed', handleHiringUpdate);
      if (bc) bc.close();
    };
  }, []);

  const setHiringActiveState = (active) => {
    const isAct = Boolean(active);
    setSettings((prev) => ({
      ...prev,
      isHiringActive: isAct,
      hiringStatus: isAct ? 'active' : 'inactive',
    }));
  };

  const isHiringActive = Boolean(settings.isHiringActive || settings.hiringStatus === 'active');
  const websiteName = settings.websiteName || settings.companyName || 'Webtrek IT Solutions';

  return (
    <WebsiteContext.Provider
      value={{
        settings,
        websiteName,
        isHiringActive,
        setHiringActiveState,
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

