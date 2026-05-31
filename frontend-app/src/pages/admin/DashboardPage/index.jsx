import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart,
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Users, Building2, Briefcase, FileText, TrendingUp, TrendingDown, 
  Clock, CheckCircle, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';
import adminService from '../../../features/admin/adminService';
import Toast from '../../../components/common/Toast';

// Palette màu hiện đại cho biểu đồ
const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [pendingJobsList, setPendingJobsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, jobsRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getPendingJobs(0, 5)
        ]);
        
        setStats(statsRes.data);
        setPendingJobsList(jobsRes.data?.content || jobsRes.data || []); 
      } catch (err) {
        setError('Không thể kết nối đến máy chủ để tải dữ liệu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã xảy ra lỗi</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm">
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            Trung tâm quản trị
          </h1>
          <p className="text-gray-500 font-medium mt-1">Giám sát toàn diện hệ thống tuyển dụng SmartMatch</p>
        </div>
        
        <div className="relative z-10 flex gap-3">
          <Link to="/admin/reports" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-sm transition-all shadow-sm">
            Xuất báo cáo
          </Link>
          <Link to="/admin/jobs-moderation" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm flex items-center gap-2">
            Duyệt tin ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          isLoading={isLoading} title="Tổng Ứng viên" value={stats?.totalUsers || 0} 
          trend="+12% so với tháng trước" isTrendUp={true}
          icon={<Users className="w-6 h-6 text-blue-600" />} colorClass="bg-blue-50" 
        />
        <StatCard 
          isLoading={isLoading} title="Tổng Doanh nghiệp" value={stats?.totalCompanies || 0} 
          trend="+5% so với tháng trước" isTrendUp={true}
          icon={<Building2 className="w-6 h-6 text-emerald-600" />} colorClass="bg-emerald-50" 
        />
        <StatCard 
          isLoading={isLoading} title="Việc làm đang mở" value={stats?.activeJobs || 0} 
          trend="-2% so với tháng trước" isTrendUp={false}
          icon={<Briefcase className="w-6 h-6 text-purple-600" />} colorClass="bg-purple-50" 
        />
        <StatCard 
          isLoading={isLoading} title="Tin chờ duyệt" value={stats?.pendingJobs || 0} 
          trend="Cần xử lý gấp" isTrendUp={null} highlight={true}
          icon={<Clock className="w-6 h-6 text-amber-600" />} colorClass="bg-amber-50" 
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LƯU LƯỢNG SYSTEM (LINE/AREA CHART) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Hoạt động hệ thống</h3>
              <p className="text-sm text-gray-500">Thống kê lượng tin đăng & ứng tuyển trong 7 ngày qua</p>
            </div>
          </div>
          
          <div className="h-72 w-full">
            {isLoading ? (
              <div className="w-full h-full bg-gray-50 animate-pulse rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.chartData || mockLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorJobs)" name="Tin tuyển dụng" />
                  <Area type="monotone" dataKey="applications" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" name="Đơn ứng tuyển" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* TỶ LỆ TRẠNG THÁI (PIE CHART) */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Trạng thái công việc</h3>
          <p className="text-sm text-gray-500 mb-6">Phân bổ tin tuyển dụng toàn sàn</p>
          
          <div className="flex-1 min-h-[250px] relative">
            {isLoading ? (
              <div className="w-48 h-48 bg-gray-50 animate-pulse rounded-full mx-auto mt-4" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.pieData || mockPieData}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {(stats?.pieData || mockPieData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value) => [`${value} tin`, 'Số lượng']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px', paddingTop: '20px' }}/>
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Center Text in Donut */}
            {!isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-extrabold text-gray-900">{stats?.totalJobs || 342}</span>
                <span className="text-xs font-medium text-gray-500">Tổng tin</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT PENDING JOBS TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tin tuyển dụng chờ duyệt</h3>
              <p className="text-xs font-medium text-gray-500">Cần xác nhận để hiển thị lên hệ thống</p>
            </div>
          </div>
          <Link to="/admin/jobs-moderation" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            Xem tất cả
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
                <th className="px-6 py-4 w-1/2">Tiêu đề công việc</th>
                <th className="px-6 py-4">ID Doanh nghiệp</th>
                <th className="px-6 py-4">Ngày đăng</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-3/4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-1/2"></div></td>
                    <td className="px-6 py-4"><div className="h-8 bg-gray-100 rounded w-20 ml-auto"></div></td>
                  </tr>
                ))
              ) : pendingJobsList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <CheckCircle className="w-12 h-12 text-emerald-300 mb-3" />
                      <p className="text-gray-600 font-medium text-lg">Tuyệt vời!</p>
                      <p className="text-gray-400 text-sm">Không còn tin tuyển dụng nào đang chờ duyệt.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingJobsList.map((job) => (
                  <tr key={job.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{job.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{job.location || 'Chưa cập nhật địa điểm'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {job.companyId}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        to={`/admin/jobs-moderation?jobId=${job.id}`} 
                        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
                      >
                        Kiểm duyệt
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ──────────────────────────────────────────────
// SUB-COMPONENTS & MOCK DATA
// ──────────────────────────────────────────────

const StatCard = ({ title, value, icon, colorClass, trend, isTrendUp, highlight, isLoading }) => (
  <div className={`p-6 rounded-3xl border transition-all duration-300 hover:shadow-md relative overflow-hidden group
    ${highlight ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-gray-100'}
  `}>
    {highlight && <div className="absolute top-0 right-0 w-2 h-full bg-amber-400" />}
    
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${colorClass}`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1
          ${isTrendUp === true ? 'text-emerald-700 bg-emerald-100' : 
            isTrendUp === false ? 'text-rose-700 bg-rose-100' : 'text-amber-700 bg-amber-100/50'}
        `}>
          {isTrendUp === true && <TrendingUp className="w-3 h-3" />}
          {isTrendUp === false && <TrendingDown className="w-3 h-3" />}
          {trend}
        </span>
      )}
    </div>
    
    <div>
      {isLoading ? (
        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-md mb-2" />
      ) : (
        <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</h3>
      )}
      <p className="text-sm font-semibold text-gray-500 mt-1">{title}</p>
    </div>
  </div>
);

// Dữ liệu giả lập (Fallback) nếu Backend chưa trả về field chartData/pieData
const mockLineData = [
  { name: 'T2', jobs: 40, applications: 120 },
  { name: 'T3', jobs: 30, applications: 140 },
  { name: 'T4', jobs: 60, applications: 200 },
  { name: 'T5', jobs: 45, applications: 180 },
  { name: 'T6', jobs: 70, applications: 250 },
  { name: 'T7', jobs: 20, applications: 90 },
  { name: 'CN', jobs: 10, applications: 40 },
];

const mockPieData = [
  { name: 'Đang mở (Active)', value: 65 },
  { name: 'Chờ duyệt (Pending)', value: 15 },
  { name: 'Đã đóng (Closed)', value: 15 },
  { name: 'Từ chối (Rejected)', value: 5 },
];