import { 
    getCharZoneRanks,
    getEncounterCharRanks
} from './index'
import { loadTokenToEnv } from '@aiueb/auth'

test('fetch character zone rankings', async () => {
    await loadTokenToEnv()
    const zoneRankings = await getCharZoneRanks('Stone Satori', 'marilith', 'NA')
    // const body = await getCharZoneRanks('Stone Satori', 'marilith', 'NA')

    console.log(zoneRankings)

    expect(2 + 2).toBe(4)
})

test('fetch character encounter ranking', async () => {
    await loadTokenToEnv()
    const zoneRankings = await getCharZoneRanks('Stone Satori', 'marilith', 'NA')
    const { id } = zoneRankings[0].encounter

    const { data } = await getEncounterCharRanks('Stone Satori', 'marilith', 'NA', id)

    console.log(data.characterData.character)

    expect(2 + 2).toBe(4)
})