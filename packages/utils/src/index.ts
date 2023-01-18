export type Timeouts = Set<string>

export const timeouts: Timeouts = new Set()

export function createTimeout(value: string, seconds: number) {
  timeouts.add(value)

  setTimeout(() => timeouts.delete(value), seconds)
}

export function deleteTimeout(value: string) {
  for (const timeout of timeouts) {
    if (timeout === value) {
      timeouts.delete(timeout)
    }
  }
}

export const randomString = (length: number): string => {
  const digits = '1234567890'
  const charsUpper = 'QWERTYUIOPASDFGHJKLZXCVBNM'
  const charsLower = charsUpper.toLowerCase()
  const chars = `${charsUpper}${charsLower}${digits}`

  let randomString: string = ''

  for (let i = 0; i < length; i++) {
    randomString += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  
  return randomString
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
