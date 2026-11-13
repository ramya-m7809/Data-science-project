import { useState } from 'react';
import { Download, Printer, CheckCircle, ArrowRight, FileText, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { hourlyArrivals, modelMetrics } from '../data/sampleData';
import { downloadCSV, recommendStaff, expectedWaitTime } from '../utils/math';

export default function Reports() {
  const [tab, setTab] = useState<'reports' | 'about'>('reports');

  const handleArrivalCSV = () => {
    downloadCSV(hourlyArrivals as any, 'arrival_analysis.csv');
  };

  const handleWorkforceCSV = () => {
    const mu = 1 / (20 / 60);
    const data = hourlyArrivals.map(d => {
      const lambdaHr = d.arrivals / 60;
      const staff = recommendStaff(lambdaHr, mu, 30);
      const waitMin = expectedWaitTime(lambdaHr, mu, staff) * 60;
      return { hour: d.label, arrivals: d.arrivals, staff_needed: staff, est_wait_min: isFinite(waitMin) ? waitMin.toFixed(1) : 0 };
    });
    downloadCSV(data as any, 'workforce_recommendations.csv');
  };

  const handleMetricsCSV = () => {
    downloadCSV([modelMetrics] as any, 'model_metrics.csv');
  };

  const workflow = [
    { step: 'Data Input', desc: 'Historical ER arrival records by hour and day' },
    { step: 'Data Cleaning', desc: 'Handle missing values, outliers, and formatting' },
    { step: 'Poisson Regression', desc: 'Fit time-varying Poisson model to arrival data' },
    { step: 'Arrival Rate Estimation', desc: 'Estimate λ(t) for each time slot' },
    { step: 'Queueing Analysis', desc: 'Apply M/M/c model with estimated λ(t)' },
    { step: 'Workforce Recommendation', desc: 'Output minimum staff per time slot' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Reports & About"
        subtitle="Download data exports and learn about the research methodology"
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-bg border border-border rounded-xl mb-6 w-fit">
        <button
          onClick={() => setTab('reports')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            tab === 'reports'
              ? 'bg-card text-navy shadow-sm border border-border'
              : 'text-secondary hover:text-navy'
          }`}
        >
          <FileText size={14} /> Reports
        </button>
        <button
          onClick={() => setTab('about')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
            tab === 'about'
              ? 'bg-card text-navy shadow-sm border border-border'
              : 'text-secondary hover:text-navy'
          }`}
        >
          <Info size={14} /> About
        </button>
      </div>

      {/* Reports Tab */}
      {tab === 'reports' && (
        <div className="space-y-5">
          {/* Downloads */}
          <div className="card">
            <h3 className="text-sm font-semibold text-navy mb-4">Download Reports</h3>
            <div className="space-y-3">
              {[
                { label: 'Arrival Analysis', desc: 'Hourly arrival data with actual and predicted values', fn: handleArrivalCSV },
                { label: 'Workforce Recommendations', desc: 'Staffing requirements and estimated wait times per hour', fn: handleWorkforceCSV },
                { label: 'Model Evaluation Metrics', desc: 'MAE, RMSE, R², and MAPE values', fn: handleMetricsCSV },
              ].map(({ label, desc, fn }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-bg transition-colors">
                  <div>
                    <p className="text-xs font-medium text-navy">{label}</p>
                    <p className="text-[11px] text-secondary">{desc}</p>
                  </div>
                  <button onClick={fn} className="btn-primary text-xs flex-shrink-0">
                    <Download size={12} /> CSV
                  </button>
                </div>
              ))}
            </div>
            <button onClick={() => window.print()} className="btn-secondary text-xs w-full mt-4 justify-center">
              <Printer size={12} /> Print Report Summary
            </button>
          </div>

          {/* Model Metrics */}
          <div className="card">
            <h3 className="text-sm font-semibold text-navy mb-4">Model Evaluation Metrics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'MAE', value: modelMetrics.mae, desc: 'Mean Absolute Error — average prediction error in arrivals' },
                { label: 'RMSE', value: modelMetrics.rmse, desc: 'Root Mean Squared Error — penalizes large errors more heavily' },
                { label: 'R²', value: modelMetrics.r2, desc: 'Proportion of variance explained by the model' },
                { label: 'MAPE', value: `${modelMetrics.mape}%`, desc: 'Mean Absolute Percentage Error' },
              ].map(({ label, value, desc }) => (
                <div key={label} className="p-4 bg-bg rounded-xl border border-border text-center">
                  <p className="text-xs text-secondary mb-1">{label}</p>
                  <p className="text-2xl font-semibold text-teal">{value}</p>
                  <p className="text-[10px] text-secondary mt-1.5 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-secondary mt-4 p-2.5 bg-amber-50 rounded-lg border border-amber-100">
              ⚠ These are illustrative demo metrics. Real values would be computed from a trained model on actual hospital data.
            </p>
          </div>
        </div>
      )}

      {/* About Tab */}
      {tab === 'about' && (
        <div className="space-y-5">
          {/* Research Overview */}
          <div className="card">
            <h3 className="text-sm font-semibold text-navy mb-4">About This Research</h3>
            <div className="space-y-4 text-xs text-secondary leading-relaxed">
              <div>
                <p className="font-semibold text-navy mb-1">Research Problem</p>
                <p>Emergency rooms face unpredictable patient volumes that lead to understaffing during peak hours and overstaffing during quiet periods, resulting in poor patient outcomes and wasted resources.</p>
              </div>
              <div>
                <p className="font-semibold text-navy mb-2">Objectives</p>
                <ul className="space-y-1.5">
                  {[
                    'Model ER patient arrival patterns using Poisson regression',
                    'Identify time-varying arrival rates by hour and day of week',
                    'Apply M/M/c queueing theory for staffing optimization',
                    'Develop the ATV-PWOA algorithm for dynamic scheduling',
                  ].map(o => (
                    <li key={o} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-teal flex-shrink-0 mt-0.5" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-navy mb-1">Methodology</p>
                <p>Historical ER arrival data is modeled using a time-varying Poisson regression. The estimated arrival rates are fed into the M/M/c queueing model to compute the minimum number of staff required to keep expected waiting times below a target threshold.</p>
              </div>
            </div>
          </div>

          {/* Workflow */}
          <div className="card">
            <h3 className="text-sm font-semibold text-navy mb-4">Algorithm Workflow</h3>
            <div className="flex flex-col sm:flex-row sm:items-start gap-0 sm:gap-0 overflow-x-auto pb-1">
              {workflow.map(({ step, desc }, i) => (
                <div key={step} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-1 flex-1 min-w-[110px]">
                  <div className="flex sm:flex-col items-center gap-1 sm:gap-0 w-full">
                    <div className="w-8 h-8 rounded-full bg-teal bg-opacity-10 text-teal text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < workflow.length - 1 && (
                      <>
                        <div className="flex-1 h-px bg-border sm:hidden" />
                        <div className="hidden sm:block w-full h-px bg-border mt-4" />
                      </>
                    )}
                  </div>
                  <div className="sm:text-center sm:px-1 pb-3 sm:pb-0">
                    <p className="text-xs font-semibold text-navy">{step}</p>
                    <p className="text-[10px] text-secondary mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="card">
            <h3 className="text-sm font-semibold text-navy mb-4">Limitations & Assumptions</h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Assumes patient arrivals follow a Poisson process',
                'Service times assumed exponentially distributed (M/M/c)',
                'Does not account for patient acuity or triage levels',
                'Staff skill mix and break schedules are not modeled',
                'Seasonal and holiday effects are not included',
                'Demo data is synthetic and not from a real hospital',
              ].map(l => (
                <div key={l} className="flex items-start gap-2 p-2.5 bg-bg rounded-lg border border-border text-xs text-secondary">
                  <ArrowRight size={11} className="text-secondary flex-shrink-0 mt-0.5" />
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
