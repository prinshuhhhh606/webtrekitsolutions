import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';

// Public Pages
import HomePage from '../pages/HomePage';
import AboutUsPage from '../pages/AboutUsPage';
import ServicesPage from '../pages/ServicesPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailsPage from '../pages/ProjectDetailsPage';
import PortfolioPage from '../pages/PortfolioPage';
import BlogPage from '../pages/BlogPage';
import BlogDetailsPage from '../pages/BlogDetailsPage';
import ContactUsPage from '../pages/ContactUsPage';
import FAQPage from '../pages/FAQPage';
import NotFoundPage from '../pages/NotFoundPage';

// Admin Pages
import AdminLayout from '../pages/admin/AdminLayout';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminServicesPage from '../pages/admin/AdminServicesPage';
import AdminProjectsPage from '../pages/admin/AdminProjectsPage';
import AdminBlogsPage from '../pages/admin/AdminBlogsPage';
import AdminQuotationsPage from '../pages/admin/AdminQuotationsPage';
import AdminClientProjectsPage from '../pages/admin/AdminClientProjectsPage';
import AdminTeamPage from '../pages/admin/AdminTeamPage';
import AdminTestimonialsPage from '../pages/admin/AdminTestimonialsPage';
import AdminFAQsPage from '../pages/admin/AdminFAQsPage';
import AdminEnquiriesPage from '../pages/admin/AdminEnquiriesPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/our-services" element={<ServicesPage />} />
        <Route path="/our-project" element={<ProjectsPage />} />
        <Route path="/our-project/:slug" element={<ProjectDetailsPage />} />
        <Route path="/blog-page" element={<BlogPage />} />
        <Route path="/blog-page/:slug" element={<BlogDetailsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Panel */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="enquiries" element={<AdminEnquiriesPage />} />
        <Route path="quotations" element={<AdminQuotationsPage />} />
        <Route path="client-projects" element={<AdminClientProjectsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="blogs" element={<AdminBlogsPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="testimonials" element={<AdminTestimonialsPage />} />
        <Route path="faqs" element={<AdminFAQsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
