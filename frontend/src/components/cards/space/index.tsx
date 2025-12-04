import type { Space } from "../../../services/space/Space";

import "./css/styles.css";

export const SpaceCard = (props: Space) => {
  return (
    <div className={`space-card ${props.status ? "occupied" : "free"}`}>
      <h2>Vaga {props.id}</h2>
      <p>Status: {props.status ? "Ocupada" : "Livre"}</p>
    </div>
  );
};
