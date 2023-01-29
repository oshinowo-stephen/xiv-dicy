import fetch from 'node-fetch'
import { load } from 'cheerio'

export const verifyCharacter = async (_key: string, charURI: string): Promise<void> => {
    const response = await fetch(charURI)

    if (response.status !== 200) {
        throw new Error('Invalid Character.')
    }

    const page = await response.text()

    const $ = load(page)
    const charBio = $.html('.character__selfintroduction')
    if (!$(charBio).text().includes(_key)) throw new Error('Invalid Key.')
}
