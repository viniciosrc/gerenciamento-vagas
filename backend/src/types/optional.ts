/**
 * Representação bem incompleta de uma monad, mas serve o seu uso.
 * - Inspired by golang xD
 */
export type Optional<L, R> =
  | { left: L, right?: never }
  | { left?: never, right: R }
