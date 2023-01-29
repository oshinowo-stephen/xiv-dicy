import fetch from 'node-fetch'

const BASE_URL: string = "https://xivapi.com/character"

export interface CharacterDetails {
    name: string
    avatarUrl: string
    portraitUrl: string
}

interface XIVApiResponse {
    Character: XIVCharacter
}

interface XIVCharacter {
    Avatar: string
    Portrait: string
    Name: string
}

export const getCharacter = async (id: string): Promise<CharacterDetails> => {
    const requestUrl = `${BASE_URL}/${id}`

    const response = await fetch(requestUrl)

    if (response.status !== 200) {
        throw new Error(`Unable to fetch character details, reason: ${response.statusText} | ${response.status}`)
    }

    const {
        Character: {
            Name: name,
            Avatar: avatarUrl,
            Portrait: portraitUrl,
        }
    } = await response.json() as XIVApiResponse

    return {
        name,
        avatarUrl,
        portraitUrl,
    } as CharacterDetails
}