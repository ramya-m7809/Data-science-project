interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

export default function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {badge && <span className="badge-teal mb-2 inline-block">{badge}</span>}
      <h1 className="text-xl font-semibold text-navy">{title}</h1>
      <p className="text-sm text-secondary mt-1">{subtitle}</p>
    </div>
  );
}
