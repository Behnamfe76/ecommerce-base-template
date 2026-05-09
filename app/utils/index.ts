export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randomFrom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]!
}

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(item => stableStringify(item)).join(',')}]`
  }

  if (value && typeof value === 'object') {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => `${key}:${stableStringify(item)}`)
      .join(',')}}`
  }

  return JSON.stringify(value)
}

export function joinUrl(base: string, path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  if (path.startsWith('/')) {
    return path.startsWith(`${base}/`) || path === base ? path : `${base}${path}`
  }

  return `${base}/${path}`
}
