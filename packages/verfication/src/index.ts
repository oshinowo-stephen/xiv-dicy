import fetch from 'node-fetch'
import { load } from 'cheerio'

export interface Character {
    name: string
    world: string
}

export const verifyCharacter = async (_key: string, charURI: string): Promise<Character> => {
    const response = await fetch(charURI)
    const page = await response.text()

    const $ = load(page)
    const charBio = $.html('.character__selfintroduction')
    const charName = $.html('.frame__chara__name')
    const charWorld = $.html('.frame__chara__world')

    if (!$(charBio).text().includes(_key)) throw new Error('Invalid Key.')

    return {
        name: $(charName).text(),
        world: $(charWorld).text()
    }
}
