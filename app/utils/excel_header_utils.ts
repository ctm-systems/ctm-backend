export function makeHeadersUnique(headers: string[]): string[] {
  const counter: Record<string, number> = {}

  return headers.map((header) => {
    const key = String(header).trim()

    if (!counter[key]) {
      counter[key] = 0
      return key
    }

    counter[key] += 1
    return `${key}.${counter[key]}`
  })
}
