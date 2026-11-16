import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox,
  Layers,
  Briefcase,
  Users,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  BookOpen,
  FileText,
  CheckSquare,
  Calendar,
} from 'lucide-react';
import { enquiriesService } from '../../services/api';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalEnquiries: 0,
    newEnquiries: 0,
    contactedEnquiries: 0,
    inProgressEnquiries: 0,
    convertedEnquiries: 0,
    closedEnquiries: 0,
    totalServices: 0,
    totalProjects: 0,
    totalTeam: 0,
    totalBlogs: 0,
    totalQuotations: 0,
    totalClientProjects: 0,
  });
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await enquiriesService.getStats();
        if (res.data.success) {
          setStats(res.data.stats);
          setRecentEnquiries(res.data.recentEnquiries || []);
          setUpcomingFollowUps(res.data.upcomingFollowUps || []);
          setRecentProjects(res.data.recentProjects || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      sub: `${stats.newEnquiries} Pending / New`,
      icon: Inbox,
      color: 'bg-blue-500',
      link: '/admin/enquiries',
    },
    {
      title: 'Quotations',
      value: stats.totalQuotations || 0,
      sub: 'Proposals & Estimates',
      icon: FileText,
      color: 'bg-indigo-600',
      link: '/admin/quotations',
    },
    {
      title: 'Client Deliveries',
      value: stats.totalClientProjects || 0,
      sub: 'Contracts In Progress',
      icon: CheckSquare,
      color: 'bg-emerald-600',
      link: '/admin/client-projects',
    },
    {
      title: 'Published Blogs',
      value: stats.totalBlogs || 0,
      sub: 'Live Articles & Trends',
      icon: BookOpen,
      color: 'bg-[#fe8a04]',
      link: '/admin/blogs',
    },
    {
      title: 'Portfolio Projects',
      value: stats.totalProjects,
      sub: 'Public Case Studies',
      icon: Briefcase,
      color: 'bg-purple-600',
      link: '/admin/projects',
    },
    {
      title: 'Active Services',
      value: stats.totalServices,
      sub: 'Service Offerings',
      icon: Layers,
      color: 'bg-cyan-600',
      link: '/admin/services',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-[#fe8a04]">
            Overview & Telemetry
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#021343]">
            Webtrek Administration Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time management for website content, projects, enquiries, and configurations.
          </p>
        </div>

        <Link
          to="/admin/enquiries"
          className="inline-flex items-center gap-2 bg-[#021343] hover:bg-[#fe8a04] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-sm"
        >
          <span>View All Inquiries</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#fe8a04] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="font-heading font-black text-3xl text-[#021343]">
                  {loading ? '...' : card.value}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{card.sub}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Enquiry Conversion Funnel Strip */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-[#021343]">
              Enquiry Pipeline & Lead Status
            </h3>
            <p className="text-xs text-gray-500">Live breakdown of leads by resolution status</p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-[#fe8a04] hover:underline flex items-center gap-1"
          >
            <span>Open Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              ● New Leads
            </span>
            <div className="text-xl font-black text-amber-900 mt-1">
              {loading ? '...' : stats.newEnquiries || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              ● Contacted
            </span>
            <div className="text-xl font-black text-blue-900 mt-1">
              {loading ? '...' : stats.contactedEnquiries || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">
              ● In Progress
            </span>
            <div className="text-xl font-black text-purple-900 mt-1">
              {loading ? '...' : stats.inProgressEnquiries || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              ● Converted
            </span>
            <div className="text-xl font-black text-emerald-900 mt-1">
              {loading ? '...' : stats.convertedEnquiries || 0}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
              ● Closed
            </span>
            <div className="text-xl font-black text-gray-800 mt-1">
              {loading ? '...' : stats.closedEnquiries || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming CRM Follow-ups Alert Strip */}
      {upcomingFollowUps && upcomingFollowUps.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <h3 className="font-heading font-bold text-base text-amber-900">
                Action Required: Upcoming Client Follow-ups ({upcomingFollowUps.length})
              </h3>
            </div>
            <Link
              to="/admin/enquiries"
              className="text-xs font-bold text-amber-800 hover:underline"
            >
              View in CRM →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingFollowUps.map((f) => (
              <div
                key={f._id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-gray-900">{f.fullName || f.name}</div>
                  <div className="text-[11px] text-gray-500">{f.service}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-700 uppercase bg-amber-100 px-2 py-0.5 rounded-md">
                    {new Date(f.nextFollowUpDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#021343]">
              Recent Customer Enquiries
            </h3>
            <p className="text-xs text-gray-500">
              Submitted from Contact Form and Consultation Modals
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs font-bold text-[#fe8a04] hover:underline"
          >
            Manage All ({stats.totalEnquiries}) →
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-6 h-6 text-[#fe8a04] animate-spin mx-auto" />
          </div>
        ) : recentEnquiries.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No customer enquiries received yet. Try submitting one from the Contact Us page!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8fafc] text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-6 font-semibold">Client Name</th>
                  <th className="py-3.5 px-6 font-semibold">Contact Info</th>
                  <th className="py-3.5 px-6 font-semibold">Requested Service</th>
                  <th className="py-3.5 px-6 font-semibold">Status</th>
                  <th className="py-3.5 px-6 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentEnquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {enq.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      <div>{enq.email}</div>
                      <div className="text-[11px] text-gray-400">{enq.phone}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200">
                        {enq.service || 'Website Development'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                          enq.status === 'New'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-100 text-blue-800'
                            : enq.status === 'In Progress'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/services"
          className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#fe8a04] shadow-sm flex items-center justify-between group"
        >
          <div>
            <h4 className="font-heading font-bold text-base text-[#021343] group-hover:text-[#fe8a04] transition-colors">
              Manage Services
            </h4>
            <p className="text-xs text-gray-500 mt-1">Add or edit digital service offerings</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-[#fe8a04] transition-all" />
        </Link>

        <Link
          to="/admin/projects"
          className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#fe8a04] shadow-sm flex items-center justify-between group"
        >
          <div>
            <h4 className="font-heading font-bold text-base text-[#021343] group-hover:text-[#fe8a04] transition-colors">
              Manage Portfolio
            </h4>
            <p className="text-xs text-gray-500 mt-1">Showcase new case studies and apps</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-[#fe8a04] transition-all" />
        </Link>

        <Link
          to="/admin/settings"
          className="p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#fe8a04] shadow-sm flex items-center justify-between group"
        >
          <div>
            <h4 className="font-heading font-bold text-base text-[#021343] group-hover:text-[#fe8a04] transition-colors">
              Site Settings & Contacts
            </h4>
            <p className="text-xs text-gray-500 mt-1">Update phone, office address & socials</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-[#fe8a04] transition-all" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

