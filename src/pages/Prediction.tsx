import { useState, useMemo } from 'react';
import { Info, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts';
import ChartCard from '../components/ChartCard';
import PageHeader from '../components/PageHeader';
import { poissonPMF, poissonCDF, poissonExceedance } from '../utils/math';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-navy">k = {label}</p>
      <p className="text-teal">P(X={label}) = {(payload[0].value * 100).toFixed(2)}%</p>
    </div>
  );
};

export default function Prediction() {
  const [lambda, setLambda] = useState(15);
  const [kMax, setKMax] = useState(30);
  const [threshold, setThreshold] = useState(20);
  const [lambdaInput, setLambdaInput] = useState('15');
  const [error, setError] = useState('');

  const distribution = useMemo(() =>
    Array.from({ length: kMax + 1 }, (_, k) => ({
      k,
      prob: poissonPMF(lambda, k),
    })), [lambda, kMax]);

  const exceedanceProb = useMemo(() => poissonExceedance(lambda, threshold), [lambda, threshold]);
  const cdfAtThreshold = useMemo(() => poissonCDF(lambda, threshold), [lambda, threshold]);

  const handleLambdaChange = (val: string) => {
    setLambdaInput(val);
    const n = parseFloat(val);
    if (isNaN(n) || n <= 0) { setError('Expected arrival rate must be a positive number.'); return; }
    if (n > 200) { setError('Rate too high. Please enter a value ≤ 200.'); return; }
    setError('');
    setLambda(n);
  };

  const reset = () => { setLambdaInput('15'); setLambda(15); setKMax(30); setThreshold(20); setError(''); };

  const hourlyPredictions = [
    { hour: '8am', lambda: 18, predicted: 18, ci_low: 15, ci_high: 21 },
    { hour: '9am', lambda: 22, predicted: 22, ci_low: 19, ci_high: 25 },
    { hour: '10am', lambda: 25, predicted: 25, ci_low: 22, ci_high: 28 },
    { hour: '11am', lambda: 27, predicted: 27, ci_low: 24, ci_high: 30 },
    { hour: '12pm', lambda: 24, predicted: 24, ci_low: 21, ci_high: 27 },
    { hour: '5pm', lambda: 28, predicted: 28, ci_low: 25, ci_high: 31 },
    { hour: '6pm', lambda: 24, predicted: 24, ci_low: 21, ci_high: 27 },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Prediction & Probability"
        subtitle="Explore Poisson distribution probabilities and arrival rate predictions"
        badge="Demo Calculations"
      />

      {/* Explainer */}
      <div className="card mb-5 border-l-4 border-teal">
        <div className="flex gap-3">
          <Info size={16} className="text-teal flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-navy mb-1">What is the Poisson Distribution?</p>
            <p className="text-xs text-secondary leading-relaxed">
              The Poisson distribution models the probability of a given number of events occurring in a fixed time interval,
              assuming events happen at a known constant rate (λ) and independently of each other.
              In emergency medicine, it is used to estimate how many patients are likely to arrive in any given hour,
              given a historical average arrival rate.
            </p>
            <p className="text-xs text-secondary mt-1.5">
              <strong className="text-navy">Formula:</strong> P(X = k) = (λ<sup>k</sup> · e<sup>−λ</sup>) / k!
              &nbsp;where λ is the expected number of arrivals and k is the count of interest.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="card mb-5">
        <h3 className="text-sm font-semibold text-navy mb-4">Distribution Calculator</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-secondary font-medium block mb-1.5">Expected Arrival Rate (λ)</label>
            <input
              type="number"
              value={lambdaInput}
              onChange={e => handleLambdaChange(e.target.value)}
              min={0.1} max={200} step={0.5}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg focus:outline-none focus:ring-1 focus:ring-teal"
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <div>
            <label className="text-xs text-secondary font-medium block mb-1.5">Max k to Display</label>
            <input
              type="number"
              value={kMax}
              onChange={e => setKMax(Math.max(5, Math.min(60, +e.target.value)))}
              min={5} max={60}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
          <div>
            <label className="text-xs text-secondary font-medium block mb-1.5">Threshold (k₀)</label>
            <input
              type="number"
              value={threshold}
              onChange={e => setThreshold(Math.max(0, +e.target.value))}
              min={0}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-bg focus:outline-none focus:ring-1 focus:ring-teal"
            />
          </div>
        </div>
        <button onClick={reset} className="btn-secondary text-xs mt-4"><RefreshCw size={12} /> Reset Defaults</button>
      </div>

      {/* Probability Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Expected Arrivals (λ)', value: lambda.toFixed(1) },
          { label: `P(X = ${Math.round(lambda)})`, value: `${(poissonPMF(lambda, Math.round(lambda)) * 100).toFixed(2)}%` },
          { label: `P(X ≤ ${threshold})`, value: `${(cdfAtThreshold * 100).toFixed(1)}%` },
          { label: `P(X ≥ ${threshold})`, value: `${(exceedanceProb * 100).toFixed(1)}%` },
        ].map(({ label, value }) => (
          <div key={label} className="card text-center">
            <p className="text-[11px] text-secondary mb-1">{label}</p>
            <p className="text-lg font-semibold text-teal">{value}</p>
          </div>
        ))}
      </div>

      {/* Distribution Chart */}
      <ChartCard
        title="Probability Distribution"
        subtitle={`P(X = k) for λ = ${lambda} — bars highlighted in teal exceed the threshold k₀ = ${threshold}`}
      >
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={distribution} barSize={Math.max(4, Math.floor(500 / (kMax + 1)))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E3E9EC" vertical={false} />
            <XAxis dataKey="k" tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false}
              interval={Math.floor(kMax / 10)} />
            <YAxis tickFormatter={v => `${(v * 100).toFixed(0)}%`} tick={{ fontSize: 9, fill: '#667784' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="prob" radius={[2, 2, 0, 0]}>
              {distribution.map(entry => (
                <Cell key={entry.k} fill={entry.k >= threshold ? '#278C87' : '#E3E9EC'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-[11px] text-secondary mt-2">
          The distribution is centered around λ = {lambda}. The probability of {threshold} or more arrivals is{' '}
          <strong className="text-navy">{(exceedanceProb * 100).toFixed(1)}%</strong>.
        </p>
      </ChartCard>

      {/* Model Predictions */}
      <div className="card mt-4">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-navy">Arrival Rate Predictions (ATV-PWOA Model)</h3>
          <span className="badge-teal">Demo</span>
        </div>
        <p className="text-xs text-secondary mb-4">
          These values represent illustrative predictions from the ATV-PWOA model. In a live deployment, these would be
          generated by a trained Poisson regression model. Values shown are for demonstration only.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {['Hour', 'Estimated λ', 'Predicted Arrivals', '95% CI Lower', '95% CI Upper'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-secondary font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hourlyPredictions.map(r => (
                <tr key={r.hour} className="border-b border-border hover:bg-bg transition-colors">
                  <td className="py-2 px-3 font-medium text-navy">{r.hour}</td>
                  <td className="py-2 px-3 text-teal font-medium">{r.lambda}</td>
                  <td className="py-2 px-3 text-navy">{r.predicted}</td>
                  <td className="py-2 px-3 text-secondary">{r.ci_low}</td>
                  <td className="py-2 px-3 text-secondary">{r.ci_high}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-secondary mt-3 p-2 bg-amber-50 rounded-lg border border-amber-100">
          ⚠ These are illustrative demo values, not real hospital data or trained model outputs.
        </p>
      </div>
    </div>
  );
}
