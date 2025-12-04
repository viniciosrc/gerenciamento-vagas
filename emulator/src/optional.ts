export type Optional<L, R> =
  | { left: L; right?: never }
  | { right: R; left?: never };
