import fetch from 'node-fetch'
import { load } from 'cheerio'

export const verifyCharacter = async (_key: string, charURI: string): Promise<void> => {
    const response = await fetch(charURI)
    const page = await response.text()

    const $ = load(page)
    const charBio = $.html('.character__selfintroduction')

    const bio = $(charBio).text()

    if (!bio.includes(_key)) {
        throw new Error('Invalid Key.')
    }
}
