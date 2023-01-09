export const generateSecretKey = (): string => {
    return `AIUEB-${(Math.random() + 1).toString(36)}`
}