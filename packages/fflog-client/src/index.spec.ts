import test from 'ava'

import { 
    getCharZoneRanks,
    getEncounterCharRanks
} from './index'
import { loadTokenToEnv } from '@aiueb/auth'

test('fetch character zone rankings', async (t) => {
    await loadTokenToEnv()
    const zoneRankings = await getCharZoneRanks('Stone Satori', 'marilith', 'NA')

    console.log(zoneRankings)

    t.pass()
})

test('fetch character encounter ranking', async (t) => {
    await loadTokenToEnv()
    const zoneRankings = await getCharZoneRanks('Stone Satori', 'marilith', 'NA')

    const { id } = zoneRankings[0].encounter

    const { data } = await getEncounterCharRanks('Stone Satori', 'marilith', 'NA', id)

    console.log(data.characterData.character)

    t.pass()
})