import { Link } from 'react-router-dom';
import { BarChart2, Users, Clock, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import StatCard from '../components/StatCard';
import { hourlyArrivals } from '../data/sampleData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-sm text-xs">
        <p className="font-medium text-navy">{label}</p>
        <p className="text-teal">{payload[0].value} arrivals</p>
      </div>
    );
  }
  return null;
};

export default function Home() {
  const totalRecords = 14280;
  const avgArrivals = 15.3;
  const busiestHour = '5pm';
  const recommendedStaff = 8;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="card mb-6 bg-gradient-to-br from-navy to-[#1e3a4a] text-white border-0">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 bg-teal rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-0.5 rounded-full">Research Project</span>
            <h1 className="text-xl font-semibold mt-2 leading-snug">
              Smarter Staffing Starts with<br />Better Predictions.
            </h1>
          </div>
        </div>
        <p className="text-sm text-white text-opacity-80 mb-5 max-w-xl">
          The <strong>ATV-PWOA</strong> algorithm applies time-varying Poisson regression to model emergency room
          patient arrival patterns, enabling data-driven workforce planning that reduces wait times and improves care.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard" className="btn-primary bg-teal text-white text-sm">
            View Dashboard <ArrowRight size={14} />
          </Link>
          <Link to="/prediction" className="btn-secondary bg-white bg-opacity-10 text-white border-white border-opacity-20 text-sm hover:bg-opacity-20">
            Explore Predictions <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Patient Records" value={totalRecords.toLocaleString()} subtitle="Sample dataset" icon={Users} />
        <StatCard title="Avg Arrivals / Hour" value={avgArrivals} subtitle="Across all days" icon={TrendingUp} accent />
        <StatCard title="Busiest Hour" value={busiestHour} subtitle="Peak demand" icon={Clock} warning />
        <StatCard title="Recommended Staff" value={`${recommendedStaff} nurses`} subtitle="At peak hours" icon={Users} accent />
      </div>

      {/* Chart + Quick Links */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card">
          <h3 className="text-sm font-semibold text-navy mb-1">Patient Arrivals by Hour</h3>
          <p className="text-xs text-secondary mb-4">Average arrivals per hour across the sample dataset</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyArrivals} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#667784' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="arrivals" fill="#278C87" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-3">
          <div className="card flex-1">
            <h3 className="text-sm font-semibold text-navy mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              {[
                { to: '/dashboard', icon: BarChart2, label: 'Dashboard', desc: 'Live stats & charts' },
                { to: '/analysis', icon: TrendingUp, label: 'Arrival Analysis', desc: 'Patterns & trends' },
                { to: '/workforce', icon: Users, label: 'Workforce', desc: 'Staffing optimizer' },
                { to: '/reports', icon: Activity, label: 'Reports', desc: 'Download & about' },
              ].map(({ to, icon: Icon, label, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-bg transition-colors group"
                >
                  <div className="w-7 h-7 bg-teal bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={13} className="text-teal" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-navy group-hover:text-teal transition-colors">{label}</p>
                    <p className="text-[10px] text-secondary">{desc}</p>
                  </div>
                  <ArrowRight size={12} className="text-secondary ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-secondary mt-4 text-center">
        ⚠ This dashboard uses illustrative sample data for research demonstration purposes only. Values do not represent real hospital records.
      </p>
    </div>
  );
}
