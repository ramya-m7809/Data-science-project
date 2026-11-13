import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Home, BarChart2, Brain, Users, FileText,
  Menu, X, Activity
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Overview' },
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analysis', icon: BarChart2, label: 'Arrival Analysis' },
  { to: '/prediction', icon: Brain, label: 'Prediction' },
  { to: '/workforce', icon: Users, label: 'Workforce' },
  { to: '/reports', icon: FileText, label: 'Reports & About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen bg-card border-r border-border fixed left-0 top-0 z-30">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
            <Activity size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-navy leading-tight">ATV-PWOA</p>
            <p className="text-[10px] text-secondary">ER Workforce Optimizer</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-teal bg-opacity-10 text-teal font-medium'
                    : 'text-secondary hover:bg-bg hover:text-navy'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border">
          <p className="text-[10px] text-secondary">Demo Mode — Sample Data</p>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-teal rounded-lg flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-navy">ATV-PWOA</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-1.5 rounded-lg hover:bg-bg transition-colors">
          {open ? <X size={20} className="text-navy" /> : <Menu size={20} className="text-navy" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-navy bg-opacity-20" />
          <nav
            className="absolute top-14 left-0 right-0 bg-card border-b border-border px-3 py-3 space-y-0.5"
            onClick={e => e.stopPropagation()}
          >
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive ? 'bg-teal bg-opacity-10 text-teal font-medium' : 'text-secondary hover:bg-bg hover:text-navy'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
