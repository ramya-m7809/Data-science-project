import { useState, useMemo } from 'react';
import { Activity, Clock, Users, TrendingUp, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import PageHeader from '../components/PageHeader';
import { hourlyArrivals, dailyArrivals, DAYS_OF_WEEK } from '../data/sampleData';
import { recommendStaff } from '../utils/math';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-navy mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [hourRange, setHourRange] = useState<[number, number]>([0, 23]);

  const filtered = useMemo(() => {
    return hourlyArrivals.filter(d => d.hour >= hourRange[0] && d.hour <= hourRange[1]);
  }, [hourRange]);

  const avgArrival = useMemo(() => {
    const vals = filtered.map(d => d.arrivals);
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '0';
  }, [filtered]);

  const peakHour = useMemo(() => {
    if (!filtered.length) return '—';
    return filtered.reduce((a, b) => (a.arrivals > b.arrivals ? a : b)).label;
  }, [filtered]);

  const peakArrivals = useMemo(() => {
    if (!filtered.length) return 0;
    return Math.max(...filtered.map(d => d.arrivals));
  }, [filtered]);

  const staffNeeded = useMemo(() => {
    return recommendStaff(peakArrivals / 60, 1 / 20, 30);
  }, [peakArrivals]);

  const staffingData = useMemo(() =>
    filtered.map(d => ({
      ...d,
      staff: recommendStaff(d.arrivals / 60, 1 / 20, 30),
    })), [filtered]);

  const reset = () => { setSelectedDay('All'); setHourRange([0, 23]); };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of patient arrivals and staffing recommendations"
        badge="Demo Data"
      />

      {/* Filters */}
      <div className="card mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-secondary font-medium">Day:</label>
          <select
            value={selectedDay}
            onChange={e => setSelectedDay(e.target.value)}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-bg text-navy focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="All">All Days</option>
            {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-secondary font-medium">From hour:</label>
          <select
            value={hourRange[0]}
            onChange={e => setHourRange([+e.target.value, hourRange[1]])}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-bg text-navy focus:outline-none focus:ring-1 focus:ring-teal"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{hourlyArrivals[i].label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-secondary font-medium">To hour:</label>
          <select
            value={hourRange[1]}
            onChange={e => setHourRange([hourRange[0], +e.target.value])}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-bg text-navy focus:outline-none focus:ring-1 focus:ring-teal"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{hourlyArrivals[i].label}</option>
            ))}
          </select>
        </div>
        <button onClick={reset} className="btn-secondary text-xs ml-auto">
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard title="Avg Arrival Rate" value={`${avgArrival}/hr`} subtitle="Filtered range" icon={Activity} accent />
        <StatCard title="Peak Arrivals" value={peakArrivals} subtitle={`At ${peakHour}`} icon={TrendingUp} warning />
        <StatCard title="Est. Wait Time" value="~18 min" subtitle="At peak load" icon={Clock} />
        <StatCard title="Recommended Staff" value={`${staffNeeded}`} subtitle="Peak period" icon={Users} accent />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <ChartCard title="Arrivals by Hour" subtitle="Actual vs predicted patient arrivals">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filtered} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="arrivals" name="Actual" fill="#278C87" radius={[2, 2, 0, 0]} />
              <Bar dataKey="predicted" name="Predicted" fill="#E3E9EC" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Historical vs Predicted Trend" subtitle="Arrival rate pattern over the day">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={filtered}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="arrivals" name="Historical" stroke="#278C87" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#667784" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Staffing Chart */}
      <ChartCard title="Staffing Requirements by Hour" subtitle="Recommended staff count based on M/M/c queueing model">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={staffingData} barSize={10}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} interval={2} />
            <YAxis tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="staff" name="Staff Needed" fill="#172B3A" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Weekly Summary */}
      <div className="mt-4">
        <ChartCard title="Weekly Arrival Summary" subtitle="Total arrivals per day of the week">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyArrivals} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#667784' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="arrivals" name="Arrivals" fill="#278C87" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
