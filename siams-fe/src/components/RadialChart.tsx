// Radial chart component
export const RadialChart = ({
  value,
  label,
  color,
  icon: Icon
}: {
  value: number; label?: string; color: string; icon: any
}) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value) * circumference;

  const getColorClass = (val: number) => {
    if (val > 0.8) return 'text-red-600';
    if (val > 0.6) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative w-10 h-10">
        <svg className="transform -rotate-90 w-10 h-10">
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-border"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 16}`}
            strokeDashoffset={`${strokeDashoffset}`}
            className={getColorClass(value)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-mono font-bold">{label}</span>
    </div>
  );
};
