import { useState, useMemo } from 'react';
import { AlertTriangle, Info, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, Legend
} from 'recharts';
import ChartCard from '../components/ChartCard';
import PageHeader from '../components/PageHeader';
import { hourlyArrivals } from '../data/sampleData';
import { recommendStaff, expectedWaitTime } from '../utils/math';

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

export default function Workforce() {
  const [serviceTimeMin, setServiceTimeMin] = useState(20);
  const [targetWaitMin, setTargetWaitMin] = useState(30);

  const mu = useMemo(() => 1 / (serviceTimeMin / 60), [serviceTimeMin]);

  const staffingData = useMemo(() =>
    hourlyArrivals.map(d => {
      const lambdaHr = d.arrivals / 60;
      const staff = recommendStaff(lambdaHr, mu, targetWaitMin);
      const waitMin = expectedWaitTime(lambdaHr, mu, staff) * 60;
      const isHigh = d.arrivals >= 22;
      return {
        label: d.label,
        arrivals: d.arrivals,
        staff,
        waitMin: isFinite(waitMin) ? +waitMin.toFixed(1) : 0,
        isHigh,
      };
    }), [mu, targetWaitMin]);

  const peakSlot = staffingData.reduce((a, b) => a.staff > b.staff ? a : b);
  const avgStaff = (staffingData.reduce((s, d) => s + d.staff, 0) / staffingData.length).toFixed(1);
  const highDemandCount = staffingData.filter(d => d.isHigh).length;

  const reset = () => { setServiceTimeMin(20); setTargetWaitMin(30); };

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Workforce Optimization"
        subtitle="ATV-PWOA staffing recommendations using the M/M/c queueing model"
        badge="ATV-PWOA"
      />

      {/* Algorithm Explainer */}
      <div className="card mb-5 border-l-4 border-teal">
        <div className="flex gap-3">
          <Info size={16} className="text-teal flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-navy mb-1">Adaptive Time-Varying Poisson Workforce Optimization Algorithm (ATV-PWOA)</p>
            <p className="text-xs text-secondary leading-relaxed">
              ATV-PWOA estimates the patient arrival rate λ(t) for each time slot using Poisson regression,
              then applies the M/M/c queueing model to determine the minimum number of staff (c) required
              to keep the expected waiting time below a target threshold W<sub>q</sub>.
              The algorithm adapts to time-of-day and day-of-week patterns, producing dynamic staffing schedules.
            </p>
            <div className="mt-2 p-2 bg-bg rounded-lg text-xs text-secondary font-mono">
              Find min c such that: W<sub>q</sub>(λ, μ, c) ≤ W<sub>target</sub> &nbsp;|&nbsp; ρ = λ/(c·μ) &lt; 1
            </div>
          </div>
        </div>
      </div>

      {/* Assumption Controls */}
      <div className="card mb-5">
        <h3 className="text-sm font-semibold text-navy mb-4">Adjust Assumptions</h3>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-secondary font-medium block mb-1.5">
              Avg Service Time per Patient (minutes)
            </label>
            <input
              type="range" min={5} max={60} step={1} value={serviceTimeMin}
              onChange={e => setServiceTimeMin(+e.target.value)}
              className="w-full accent-teal"
            />
            <div className="flex justify-between text-xs text-secondary mt-1">
              <span>5 min</span>
              <span className="font-medium text-navy">{serviceTimeMin} min</span>
              <span>60 min</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-secondary font-medium block mb-1.5">
              Target Max Waiting Time (minutes)
            </label>
            <input
              type="range" min={5} max={120} step={5} value={targetWaitMin}
              onChange={e => setTargetWaitMin(+e.target.value)}
              className="w-full accent-teal"
            />
            <div className="flex justify-between text-xs text-secondary mt-1">
              <span>5 min</span>
              <span className="font-medium text-navy">{targetWaitMin} min</span>
              <span>120 min</span>
            </div>
          </div>
        </div>
        <button onClick={reset} className="btn-secondary text-xs mt-4"><RefreshCw size={12} /> Reset Defaults</button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Peak Staff Needed', value: peakSlot.staff, sub: `At ${peakSlot.label}` },
          { label: 'Avg Staff / Hour', value: avgStaff, sub: 'Across all hours' },
          { label: 'High-Demand Slots', value: highDemandCount, sub: '≥22 arrivals/hr' },
          { label: 'Target Wait Time', value: `${targetWaitMin} min`, sub: 'User-defined' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="card text-center">
            <p className="text-[11px] text-secondary mb-1">{label}</p>
            <p className="text-xl font-semibold text-navy">{value}</p>
            <p className="text-[11px] text-secondary">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 mb-5">
        <ChartCard title="Recommended Staff by Hour" subtitle="Minimum staff to meet target wait time">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={staffingData} barSize={9}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="staff" name="Staff" radius={[2, 2, 0, 0]}>
                {staffingData.map((d, i) => (
                  <Cell key={i} fill={d.isHigh ? '#D97706' : '#278C87'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-secondary">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-teal inline-block" /> Normal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> High demand</span>
          </div>
        </ChartCard>

        <ChartCard title="Arrivals vs Staff Required" subtitle="Relationship between patient load and staffing">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={staffingData} barSize={7}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="arrivals" name="Arrivals" fill="#E3E9EC" radius={[2, 2, 0, 0]} />
              <Bar dataKey="staff" name="Staff" fill="#172B3A" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recommendations Table */}
      <div className="card">
        <h3 className="text-sm font-semibold text-navy mb-3">Detailed Staffing Recommendations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Hour', 'Avg Arrivals', 'Arrival Rate (λ/hr)', 'Staff Needed', 'Est. Wait (min)', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-secondary font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staffingData.map(d => (
                <tr key={d.label} className={`border-b border-border hover:bg-bg transition-colors ${d.isHigh ? 'bg-amber-50' : ''}`}>
                  <td className="py-2 px-3 font-medium text-navy">{d.label}</td>
                  <td className="py-2 px-3 text-navy">{d.arrivals}</td>
                  <td className="py-2 px-3 text-secondary">{(d.arrivals / 60).toFixed(3)}</td>
                  <td className="py-2 px-3 font-semibold text-navy">{d.staff}</td>
                  <td className="py-2 px-3 text-navy">{d.waitMin}</td>
                  <td className="py-2 px-3">
                    {d.isHigh ? (
                      <span className="badge-warning flex items-center gap-1 w-fit">
                        <AlertTriangle size={10} /> High
                      </span>
                    ) : (
                      <span className="badge-teal">Normal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-secondary mt-3 p-2 bg-bg rounded-lg border border-border">
          ℹ Recommendations are calculated using the M/M/c queueing model with the assumptions above.
          Actual staffing decisions should account for skill mix, breaks, and clinical judgment.
        </p>
      </div>
    </div>
  );
}
