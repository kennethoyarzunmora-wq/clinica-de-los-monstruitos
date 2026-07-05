interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="progress" aria-label={label ?? `Paso ${current} de ${total}`}>
      <div className="progress__top">
        <span>{label ?? `Paso ${current} de ${total}`}</span>
        <span>{percent}%</span>
      </div>
      <div className="progress__track">
        <span className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
