import { useState, useMemo } from 'react';
import { Download, Search, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import ChartCard from '../components/ChartCard';
import PageHeader from '../components/PageHeader';
import { hourlyArrivals, dailyArrivals, patientRecords, DAYS_OF_WEEK } from '../data/sampleData';
import { downloadCSV } from '../utils/math';

type SortKey = 'id' | 'day' | 'hour' | 'arrivals';
type SortDir = 'asc' | 'desc';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-navy mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Analysis() {
  const [dayFilter, setDayFilter] = useState('All');
  const [hourMin, setHourMin] = useState(0);
  const [hourMax, setHourMax] = useState(23);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('hour');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const filteredRecords = useMemo(() => {
    let data = patientRecords.filter(r =>
      (dayFilter === 'All' || r.day === dayFilter) &&
      r.hour >= hourMin && r.hour <= hourMax &&
      (search === '' || r.day.toLowerCase().includes(search.toLowerCase()) || String(r.hour).includes(search))
    );
    data = [...data].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [dayFilter, hourMin, hourMax, search, sortKey, sortDir]);

  const paged = filteredRecords.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);

  const filteredHourly = useMemo(() =>
    hourlyArrivals.filter(d => d.hour >= hourMin && d.hour <= hourMax),
    [hourMin, hourMax]
  );

  const busiestHour = hourlyArrivals.reduce((a, b) => a.arrivals > b.arrivals ? a : b);
  const busiestDay = dailyArrivals.reduce((a, b) => a.arrivals > b.arrivals ? a : b);
  const quietestHour = hourlyArrivals.reduce((a, b) => a.arrivals < b.arrivals ? a : b);

  const sort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={8} className={sortKey === k && sortDir === 'asc' ? 'text-teal' : 'text-secondary opacity-40'} />
      <ChevronDown size={8} className={sortKey === k && sortDir === 'desc' ? 'text-teal' : 'text-secondary opacity-40'} />
    </span>
  );

  const reset = () => { setDayFilter('All'); setHourMin(0); setHourMax(23); setSearch(''); setPage(1); };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Patient Arrival Analysis"
        subtitle="Explore arrival patterns by hour and day of the week"
        badge="Sample Data"
      />

      {/* Insight Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Busiest Hour', value: busiestHour.label, sub: `${busiestHour.arrivals} avg arrivals`, color: 'text-amber-600' },
          { label: 'Busiest Day', value: busiestDay.day, sub: `${busiestDay.arrivals} total arrivals`, color: 'text-teal' },
          { label: 'Quietest Hour', value: quietestHour.label, sub: `${quietestHour.arrivals} avg arrivals`, color: 'text-secondary' },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="card text-center">
            <p className="text-xs text-secondary mb-1">{label}</p>
            <p className={`text-lg font-semibold ${color}`}>{value}</p>
            <p className="text-[11px] text-secondary">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        <ChartCard title="Arrivals by Hour" subtitle="Average patient arrivals per hour">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={filteredHourly} barSize={9}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="arrivals" name="Arrivals" fill="#278C87" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-secondary mt-2">Peak demand occurs in the late morning and early evening, with the lowest activity in the early morning hours.</p>
        </ChartCard>

        <ChartCard title="Arrivals by Day of Week" subtitle="Total arrivals per weekday">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyArrivals}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#667784' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="arrivals" name="Actual" stroke="#278C87" strokeWidth={2} dot={{ r: 3, fill: '#278C87' }} />
              <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#667784" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[11px] text-secondary mt-2">Weekends show higher patient volumes, with Saturday being the busiest day overall.</p>
        </ChartCard>
      </div>

      {/* Filters + Table */}
      <div className="card">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search records..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-border rounded-lg bg-bg focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <select value={dayFilter} onChange={e => { setDayFilter(e.target.value); setPage(1); }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-bg text-navy focus:outline-none focus:ring-1 focus:ring-teal">
            <option value="All">All Days</option>
            {DAYS_OF_WEEK.map(d => <option key={d}>{d}</option>)}
          </select>
          <select value={hourMin} onChange={e => { setHourMin(+e.target.value); setPage(1); }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-bg text-navy focus:outline-none focus:ring-1 focus:ring-teal">
            {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{hourlyArrivals[i].label}</option>)}
          </select>
          <select value={hourMax} onChange={e => { setHourMax(+e.target.value); setPage(1); }}
            className="text-xs border border-border rounded-lg px-2 py-1.5 bg-bg text-navy focus:outline-none focus:ring-1 focus:ring-teal">
            {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{hourlyArrivals[i].label}</option>)}
          </select>
          <button onClick={reset} className="btn-secondary text-xs"><RefreshCw size={12} /> Reset</button>
          <button onClick={() => downloadCSV(filteredRecords as any, 'arrival_records.csv')} className="btn-primary text-xs">
            <Download size={12} /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {([['id', '#'], ['day', 'Day'], ['hour', 'Hour'], ['arrivals', 'Arrivals']] as [SortKey, string][]).map(([k, label]) => (
                  <th key={k} onClick={() => sort(k)}
                    className="text-left py-2 px-3 text-secondary font-medium cursor-pointer hover:text-navy select-none">
                    {label}<SortIcon k={k} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-secondary">No records match the current filters.</td></tr>
              ) : paged.map(r => (
                <tr key={r.id} className="border-b border-border hover:bg-bg transition-colors">
                  <td className="py-2 px-3 text-secondary">{r.id}</td>
                  <td className="py-2 px-3 font-medium text-navy">{r.day}</td>
                  <td className="py-2 px-3 text-navy">{r.label}</td>
                  <td className="py-2 px-3">
                    <span className={`font-medium ${r.arrivals >= 20 ? 'text-amber-600' : 'text-navy'}`}>{r.arrivals}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <p className="text-xs text-secondary">{filteredRecords.length} records</p>
            <div className="flex items-center gap-1">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-2 py-1 text-xs border border-border rounded disabled:opacity-40 hover:bg-bg transition-colors">Prev</button>
              <span className="text-xs text-secondary px-2">{page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="px-2 py-1 text-xs border border-border rounded disabled:opacity-40 hover:bg-bg transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
