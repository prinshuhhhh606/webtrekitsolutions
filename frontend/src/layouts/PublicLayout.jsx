import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from '../components/common/Topbar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EnquiryModal from '../components/common/EnquiryModal';
import WhatsAppButton from '../components/common/WhatsAppButton';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <EnquiryModal />
      <WhatsAppButton />
    </div>
  );
};

export default PublicLayout;

