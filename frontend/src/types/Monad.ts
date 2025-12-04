export type Monad<L, R> =
  | { left: L; right?: never }
  | { right: R; left?: never }