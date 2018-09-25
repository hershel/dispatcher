/**
 * Throw error if the value is false
 * @param value value
 * @param message message
 */
export const assert = (value: boolean, message: string) => {
  if (value === false) throw new TypeError(message)
}
