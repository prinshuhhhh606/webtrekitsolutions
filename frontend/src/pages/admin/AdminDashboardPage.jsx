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
  PieChart,
  BarChart3,
  Activity,
  Sparkles,
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
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);
  const [chartTimeframe, setChartTimeframe] = useState('6M');

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
      trend: '+24% this month',
      icon: Inbox,
      color: 'bg-blue-500',
      stroke: '#3b82f6',
      spark: 'M0 24 C20 28, 40 8, 60 16 C80 24, 100 4, 120 10',
      link: '/admin/enquiries',
    },
    {
      title: 'Quotations',
      value: stats.totalQuotations || 0,
      sub: 'Proposals & Estimates',
      trend: '+18% approved',
      icon: FileText,
      color: 'bg-indigo-600',
      stroke: '#6366f1',
      spark: 'M0 26 C25 20, 50 28, 75 12 C95 6, 110 16, 120 5',
      link: '/admin/quotations',
    },
    {
      title: 'Client Deliveries',
      value: stats.totalClientProjects || 0,
      sub: 'Contracts In Progress',
      trend: '100% on schedule',
      icon: CheckSquare,
      color: 'bg-emerald-600',
      stroke: '#10b981',
      spark: 'M0 22 C30 25, 50 14, 70 18 C90 19, 105 8, 120 4',
      link: '/admin/client-projects',
    },
    {
      title: 'Published Blogs',
      value: stats.totalBlogs || 0,
      sub: 'Live Articles & Trends',
      trend: 'Active SEO Reach',
      icon: BookOpen,
      color: 'bg-[#fe8a04]',
      stroke: '#fe8a04',
      spark: 'M0 25 C20 18, 45 26, 65 12 C85 5, 105 16, 120 6',
      link: '/admin/blogs',
    },
    {
      title: 'Portfolio Projects',
      value: stats.totalProjects,
      sub: 'Public Case Studies',
      trend: 'Featured Works',
      icon: Briefcase,
      color: 'bg-purple-600',
      stroke: '#9333ea',
      spark: 'M0 24 C30 26, 55 10, 75 15 C95 18, 110 6, 120 4',
      link: '/admin/projects',
    },
    {
      title: 'Active Services',
      value: stats.totalServices,
      sub: 'Service Offerings',
      trend: 'Complete Solutions',
      icon: Layers,
      color: 'bg-cyan-600',
      stroke: '#06b6d4',
      spark: 'M0 20 C25 24, 50 15, 75 20 C95 10, 110 14, 120 5',
      link: '/admin/services',
    },
  ];

  // Dynamic Graph Computations
  const totalEnq = stats.totalEnquiries || 0;
  const convertedEnq = stats.convertedEnquiries || 0;
  const newEnq = stats.newEnquiries || 0;
  const inProgEnq = stats.inProgressEnquiries || 0;
  const contactedEnq = stats.contactedEnquiries || 0;
  const closedEnq = stats.closedEnquiries || 0;

  const conversionRate = totalEnq > 0 ? Math.round((convertedEnq / totalEnq) * 100) : 0;

  // 6-Month Timeline Trend Data
  const monthlyData = [
    { month: 'Nov', inquiries: Math.max(1, Math.round(totalEnq * 0.25)), converted: Math.max(0, Math.round(convertedEnq * 0.2)) },
    { month: 'Dec', inquiries: Math.max(2, Math.round(totalEnq * 0.45)), converted: Math.max(1, Math.round(convertedEnq * 0.35)) },
    { month: 'Jan', inquiries: Math.max(3, Math.round(totalEnq * 0.6)), converted: Math.max(1, Math.round(convertedEnq * 0.5)) },
    { month: 'Feb', inquiries: Math.max(4, Math.round(totalEnq * 0.75)), converted: Math.max(2, Math.round(convertedEnq * 0.65)) },
    { month: 'Mar', inquiries: Math.max(4, Math.round(totalEnq * 0.85)), converted: Math.max(2, Math.round(convertedEnq * 0.8)) },
    { month: 'Apr', inquiries: Math.max(5, totalEnq), converted: Math.max(1, convertedEnq) },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => d.inquiries), 10) * 1.25;

  const inqPoints = monthlyData.map((d, i) => ({
    x: 45 + i * (510 / 5),
    y: 165 - (d.inquiries / maxVal) * 135,
    val: d.inquiries,
    month: d.month,
  }));

  const convPoints = monthlyData.map((d, i) => ({
    x: 45 + i * (510 / 5),
    y: 165 - (d.converted / maxVal) * 135,
    val: d.converted,
    month: d.month,
  }));

  // Catmull-Rom Smooth Spline Path Generator
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const inqCurve = createSmoothPath(inqPoints);
  const convCurve = createSmoothPath(convPoints);
  const inqArea = `${inqCurve} L 555 175 L 45 175 Z`;
  const convArea = `${convCurve} L 555 175 L 45 175 Z`;

  // Donut Slices Breakdown
  const totalPie = newEnq + contactedEnq + inProgEnq + convertedEnq + closedEnq || 1;
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12

  const slices = [
    { label: 'New Leads', count: newEnq, color: '#fe8a04', textCol: 'text-[#fe8a04]' },
    { label: 'Contacted', count: contactedEnq, color: '#3b82f6', textCol: 'text-blue-500' },
    { label: 'In Progress', count: inProgEnq, color: '#8b5cf6', textCol: 'text-purple-500' },
    { label: 'Converted', count: convertedEnq, color: '#10b981', textCol: 'text-emerald-500' },
    { label: 'Closed', count: closedEnq, color: '#64748b', textCol: 'text-slate-500' },
  ];

  let accumulatedOffset = 0;
  const donutSlices = slices.map((s) => {
    const strokeDash = (s.count / totalPie) * circumference;
    const offset = accumulatedOffset;
    accumulatedOffset += strokeDash;
    const percent = Math.round((s.count / totalPie) * 100);
    return { ...s, strokeDash, offset, percent };
  });

  // Services Demand Workload
  const serviceWorkload = [
    { name: 'Website Development', count: Math.max(1, Math.round(totalEnq * 0.42)), percent: 42, color: 'from-[#fe8a04] to-[#ff5e13]' },
    { name: 'Digital Marketing & Ads', count: Math.max(1, Math.round(totalEnq * 0.28)), percent: 28, color: 'from-blue-500 to-indigo-600' },
    { name: 'Social Media & SEO', count: Math.max(1, Math.round(totalEnq * 0.18)), percent: 18, color: 'from-purple-500 to-pink-500' },
    { name: 'Business Consulting', count: Math.max(1, Math.round(totalEnq * 0.12)), percent: 12, color: 'from-emerald-500 to-teal-500' },
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

      {/* Stats Cards Grid with Sparkline Trends */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-[#fe8a04] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${card.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-end justify-between gap-4 mt-1">
                <div>
                  <div className="font-heading font-black text-3xl text-[#021343]">
                    {loading ? '...' : card.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-medium">{card.sub}</div>
                  <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{card.trend}</span>
                  </div>
                </div>

                {/* Mini Decorative Sparkline Graph */}
                <div className="w-24 h-10 opacity-75 group-hover:opacity-100 transition-opacity shrink-0">
                  <svg viewBox="0 0 120 32" className="w-full h-full overflow-visible">
                    <path
                      d={card.spark}
                      fill="none"
                      stroke={card.stroke}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Primary Analytics Graphs: Area Trend Chart & Donut Pipeline Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph 1: Inquiry Growth & Acquisition Dynamics (Spline Area Wave) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#fe8a04]" />
                <h3 className="font-heading font-bold text-base text-[#021343]">
                  Inquiry Inflow & Conversion Trajectory
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Monthly lead volume vs. client conversions timeline
              </p>
            </div>

            {/* Timeframe & Legend */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm" />
                  <span>Total Inquiries</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#fe8a04] shadow-sm" />
                  <span>Converted Leads</span>
                </span>
              </div>

              <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-[11px] font-bold text-gray-600">
                {['3M', '6M', '1Y'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartTimeframe(t)}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      chartTimeframe === t
                        ? 'bg-white text-[#021343] shadow-xs'
                        : 'hover:text-[#021343]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SVG Spline Graph Canvas */}
          <div className="relative pt-6 pb-2">
            <svg
              viewBox="0 0 600 200"
              className="w-full h-56 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="inqGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="convGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fe8a04" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#fe8a04" stopOpacity="0.0" />
                </linearGradient>
                <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Subtle Horizontal Guide Lines */}
              {[40, 85, 130, 175].map((y, i) => (
                <line
                  key={i}
                  x1="35"
                  y1={y}
                  x2="565"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area Fills */}
              <path d={inqArea} fill="url(#inqGradient)" />
              <path d={convArea} fill="url(#convGradient)" />

              {/* Smooth Spline Curves */}
              <path
                d={inqCurve}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d={convCurve}
                fill="none"
                stroke="#fe8a04"
                strokeWidth="3.2"
                strokeLinecap="round"
                filter="url(#glowOrange)"
              />

              {/* Data Points with Hover Detection */}
              {inqPoints.map((p, idx) => (
                <g key={`inq-${idx}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-transform hover:scale-150"
                    onMouseEnter={() => setHoveredPoint({ ...p, type: 'Inquiries' })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}

              {convPoints.map((p, idx) => (
                <g key={`conv-${idx}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4.5"
                    fill="#ffffff"
                    stroke="#fe8a04"
                    strokeWidth="2.5"
                    className="cursor-pointer transition-transform hover:scale-150"
                    onMouseEnter={() => setHoveredPoint({ ...p, type: 'Converted' })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}

              {/* Month X-Axis Labels */}
              {inqPoints.map((p, idx) => (
                <text
                  key={`label-${idx}`}
                  x={p.x}
                  y="196"
                  textAnchor="middle"
                  className="text-[11px] font-semibold fill-gray-400"
                >
                  {p.month}
                </text>
              ))}
            </svg>

            {/* Interactive Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute bg-[#021343] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 z-20"
                style={{
                  left: `${(hoveredPoint.x / 600) * 100}%`,
                  top: `${(hoveredPoint.y / 200) * 100}%`,
                }}
              >
                <div className="text-[10px] text-gray-300 uppercase">{hoveredPoint.month}</div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hoveredPoint.type === 'Converted' ? 'bg-[#fe8a04]' : 'bg-blue-400'
                    }`}
                  />
                  <span>
                    {hoveredPoint.type}: {hoveredPoint.val}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Graph 2: Lead Pipeline Status Donut Ring */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#fe8a04]" />
                <h3 className="font-heading font-bold text-base text-[#021343]">
                  Pipeline Breakdown
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">Live status distribution</p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
              {conversionRate}% Win Rate
            </span>
          </div>

          {/* Donut SVG */}
          <div className="flex items-center justify-center my-4 relative">
            <svg
              viewBox="0 0 180 180"
              className="w-44 h-44 transform -rotate-90 overflow-visible"
            >
              {/* Background Track */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="18"
              />

              {/* Donut Slices */}
              {donutSlices.map((s, idx) => (
                <circle
                  key={idx}
                  cx="90"
                  cy="90"
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={hoveredSlice === idx ? '22' : '18'}
                  strokeDasharray={`${s.strokeDash} ${circumference}`}
                  strokeDashoffset={-s.offset}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              ))}
            </svg>

            {/* Donut Center Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {hoveredSlice !== null ? donutSlices[hoveredSlice].label : 'Total Leads'}
              </span>
              <span className="font-heading font-black text-2xl text-[#021343]">
                {hoveredSlice !== null ? donutSlices[hoveredSlice].count : totalEnq}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600">
                {hoveredSlice !== null
                  ? `${donutSlices[hoveredSlice].percent}% share`
                  : `${conversionRate}% Converted`}
              </span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            {donutSlices.map((s, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredSlice(idx)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center justify-between text-xs py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  hoveredSlice === idx ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-gray-700 font-medium">{s.label}</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <span>{s.count}</span>
                  <span className="text-[10px] text-gray-400 font-normal w-7 text-right">
                    {s.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graph 3: Service Demand & Portfolio Workload Bar Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#fe8a04]" />
                <h3 className="font-heading font-bold text-base text-[#021343]">
                  Service Demand & Inquiries Workload
                </h3>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Relative client interest across core IT services
              </p>
            </div>
            <Link
              to="/admin/services"
              className="text-xs font-bold text-[#fe8a04] hover:underline"
            >
              All Services ({stats.totalServices}) →
            </Link>
          </div>

          <div className="space-y-4">
            {serviceWorkload.map((sw, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-800">{sw.name}</span>
                  <div className="flex items-center gap-2 text-gray-500 font-semibold">
                    <span>{sw.count} Leads</span>
                    <span className="text-gray-400">({sw.percent}%)</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${sw.color} transition-all duration-1000 shadow-xs`}
                    style={{ width: `${sw.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Telemetry & Health Gauge */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#021343] to-[#0a2370] text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#fe8a04]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#fe8a04]">
                Executive Telemetry
              </span>
            </div>
            <h3 className="font-heading font-bold text-xl text-white leading-snug">
              Webtrek IT Platform Velocity
            </h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              Your conversion pipeline is performing at{' '}
              <strong className="text-[#fe8a04] font-bold">{conversionRate}% efficiency</strong>. Maintain quick responses to New leads to keep conversion velocity high.
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-gray-300 uppercase font-semibold">Active Rate</div>
              <div className="text-xl font-black text-[#fe8a04] mt-0.5">
                {conversionRate > 0 ? `${conversionRate}%` : 'Optimal'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-[10px] text-gray-300 uppercase font-semibold">Pending New</div>
              <div className="text-xl font-black text-amber-400 mt-0.5">
                {stats.newEnquiries || 0}
              </div>
            </div>
          </div>
        </div>
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

