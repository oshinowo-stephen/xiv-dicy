import test from 'ava'

import { getCharZoneRanks } from './index'
import { loadTokenToEnv } from '@aiueb/auth'

test('fetch character zone rankings', async (t) => {
    await loadTokenToEnv()

    await t.notThrowsAsync(getCharZoneRanks('Stone Satori', 'marilith', 'NA'))
})

test('character with no logs?', async (t) => {
    await loadTokenToEnv()

    await t.throwsAsync(getCharZoneRanks('Ice Wallow', 'marilith', 'NA'))
})

test('zone details details', async (t) => {
    await loadTokenToEnv()
    const rankings = await getCharZoneRanks('Stone Satori', 'marilith', 'NA')
    const { encounter, rankPercent, bestSpec } = rankings[0]    
    
    t.is(bestSpec, 'DarkKnight')
    t.truthy(Math.floor(rankPercent) > 0)
    t.is(encounter.name.toLocaleLowerCase(), 'proto-carbuncle')
})
