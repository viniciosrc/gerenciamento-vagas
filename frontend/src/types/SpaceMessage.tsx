import type { Space } from "../services/space/Space";

export type SpaceSocketMessage =
  | ({ type: "SPACE_CREATED" } & Space)
  | { type: "SPACE_GETBYID" }
  | ({ type: "SPACE_UPDATED" } & Space)
  | ({ type: "SPACE_DELETED" } & Space);
