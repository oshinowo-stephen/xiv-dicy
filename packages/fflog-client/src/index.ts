import needle, { NeedleResponse } from 'needle'

import {
    CharacterZoneQuery,
    CharacterEncounterQuery
} from './schemas'

function processRequest(body: QueryRequest): Promise<NeedleResponse> {
    return new Promise((res, rej) => {
        needle.post(
            'https://www.fflogs.com/api/v2/client',
            JSON.stringify({ ...body }),
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.FF_LOGS_TOKEN}`
                }
            },
            (error, resp) => error !== undefined
                ? res(resp)
                : rej(error)
        )
    })    
} 

export const getCharZoneRanks = async (name: string, slug: string, region: string): Promise<ZoneRanking[]> => {
    const response = await processRequest({
        query: CharacterZoneQuery,
        variables: {
            name,
            slug,
            region
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(`Error on request: ${response.statusMessage} | ${response.statusCode}`)
    }

    return response.body
        .data
        .characterData
        .character
        .zoneRankings
        .rankings as ZoneRanking[]
}

export const getEncounterCharRanks = async (name: string, slug: string, region: string, enounterID: number): Promise<any> => {
    const response = await processRequest({
        query: CharacterEncounterQuery,
        variables: {
            name,
            slug,
            region,
            encounter: enounterID
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(`Error on response: ${response.statusMessage} | ${response.statusCode}`)
    }

    return response.body
}

interface Query {
    name: string,
    slug: string,
    region: string
    encounter?: number
}

interface ZoneRanking {
    encounter: Encounter
}

interface Encounter {
    id: number
    name: string
    bestSpec: string
    totalKills: number
    rankPercent: number
    fastestKill: number
}

interface QueryRequest {
    query: string,
    variables: Query
}