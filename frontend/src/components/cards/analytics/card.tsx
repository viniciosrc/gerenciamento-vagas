import "./css/card.css";

export type AnalyticsCardProps = {
  prefix: string;
  value: number;
  className?: string;
  suffix: string;
};

export const AnalyticsCard = ({
  prefix,
  value,
  className,
  suffix,
}: AnalyticsCardProps) => {
  return (
    <div className={`analytics-card-container ${className || ""}`}>
      <h3 className="prefix">{prefix}</h3>
      <h1 className="value">{value}</h1>
      <h3 className="suffix">{suffix}</h3>
    </div>
  );
};
