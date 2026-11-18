import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Briefcase,
  Users,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  BookOpen,
  FileText,
  CheckSquare,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWebsite } from '../../context/WebsiteContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { admin, logout, isAuthenticated, loading } = useAuth();
  const { websiteName } = useWebsite();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not authenticated, redirect to login
  if (!loading && !isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Enquiries (CRM)', path: '/admin/enquiries', icon: Inbox },
    { name: 'Quotations', path: '/admin/quotations', icon: FileText },
    { name: 'Client Delivery', path: '/admin/client-projects', icon: CheckSquare },
    { name: 'Services CMS', path: '/admin/services', icon: Layers },
    { name: 'Projects CMS', path: '/admin/projects', icon: Briefcase },
    { name: 'Blogs & News', path: '/admin/blogs', icon: BookOpen },
    { name: 'Team Members', path: '/admin/team', icon: Users },
    { name: 'Hiring & Careers', path: '/admin/hiring', icon: UserPlus },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { name: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#021343] text-white flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <Link to="/" target="_blank" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#fe8a04] flex items-center justify-center font-bold text-white text-sm">
                {(websiteName || 'W').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xs tracking-tight uppercase truncate max-w-[130px]">
                  {websiteName || 'WEBTREK'} ADMIN
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#fe8a04]">
                  Control Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-140px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#fe8a04] text-white shadow-glow-orange'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer actions & user info */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/10 hover:bg-white/15 text-xs text-gray-200 rounded-lg transition-colors font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#fe8a04]/20 border border-[#fe8a04] text-[#fe8a04] flex items-center justify-center font-bold text-xs shrink-0">
                A
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">
                  {admin?.name || 'Administrator'}
                </div>
                <div className="text-[10px] text-gray-400 truncate">
                  {admin?.email || 'admin@webtrek.in'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>Secure Admin Session • Authorized Access Only</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

