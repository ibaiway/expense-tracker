/**
 * "Deep" version of {@link Partial}. Allows to apply _partial_ modifier
 * to arbitrarily nested types.
 *
 * ---
 *
 * Usage example:
 *
 * ```
 * interface Type {
 *   a: string
 *   b: {
 *     c: string,
 *     d: number
 *   }
 * }
 *
 * let example: DeepPartial<Type> = {
 *   b: {
 *     d: 33
 *   }
 * }
 * ```
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends NonNullable<(infer U)[]> // Is non-nullable array?
    ? U[]
    : T[P] extends (infer U)[] | null // Is nullable array?
    ? U[] | null
    : T[P] extends Record<any, any> | null | undefined // Is record to recurse?
    ? DeepPartial<T[P]>
    : T[P] // Value
}
