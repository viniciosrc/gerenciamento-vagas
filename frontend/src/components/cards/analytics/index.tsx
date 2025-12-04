import { AnalyticsCard } from "./card";

import "./css/styles.css";

export type AnalyticsCardsProps = {
  totalSpace: number;
  avaliableSpace: number;
};

export const AnalyticsCards = ({
  totalSpace,
  avaliableSpace,
}: AnalyticsCardsProps) => {
  const occupiedSpace = totalSpace - avaliableSpace;
  const occupationPercentage = Math.round((occupiedSpace / totalSpace) * 100);

  return (
    <div className="analytics-cards-wrapper">
      <AnalyticsCard
        prefix="Total De Vagas"
        value={totalSpace}
        className="total-spaces"
        suffix="Disponíveis"
      />
      <AnalyticsCard
        prefix="Disponíveis"
        className="avaliable-spaces"
        value={avaliableSpace}
        suffix="Desocupadas atualmente"
      />
      <AnalyticsCard
        prefix="Ocupadas"
        value={occupiedSpace}
        suffix="Do Total de Vagas"
        className="unavailable-spaces"
      />
      <AnalyticsCard
        prefix="Taxas de Ocupação"
        value={occupationPercentage}
        suffix="Do Total de Vagas"
        className="occupation-spaces"
      />
    </div>
  );
};
