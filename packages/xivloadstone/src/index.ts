import fetch from 'node-fetch'

const BASE_URL: string = "https://xivapi.com/character"

export interface CharacterDetails {
    name: string
    world: string
    avatarUrl: string
    dataCenter: string
    portraitUrl: string
}

interface XIVApiResponse {
    Character: XIVCharacter
}

interface XIVCharacter {
    Avatar: string
    Portrait: string
    DC: string
    Server: string
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
            DC: dataCenter,
            Name: name,
            Server: world,
            Avatar: avatarUrl,
            Portrait: portraitUrl,
        }
    } = await response.json() as XIVApiResponse

    return {
        name,
        world,
        avatarUrl,
        dataCenter,
        portraitUrl,
    } as CharacterDetails
}