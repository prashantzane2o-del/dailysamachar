/** Serializes data for an inline JSON script without allowing HTML breakouts. */
export function safeJson(value: unknown): string {
  const serialized = JSON.stringify(value);
  return (serialized ?? "null")
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}
