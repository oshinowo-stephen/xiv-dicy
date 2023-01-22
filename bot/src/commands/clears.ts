import { createCommand } from '@hephaestus/eris'

import {
    getCharZoneRanks,
    // getEncounterCharRanks
} from '@aiueb/fflogs'

import { fetchPlayer, findMain, getDCRegion } from '../service'

interface CharacterSeverInfo {
    world: string
    region: string
}

interface Encounter {
    name: string
    specJob: string
    totalKills: number
    rankNumber: number
    fastestKill: number
}

export default createCommand({
    type: 1,
    name: 'encounters',
    options: [
        {
            type: 3,
            name: 'player',
            required: false,
            description: 'A target member/player',
        }
    ],
    description: 'List player\'s encounters',
    action: async (interaction, args): Promise<void> => {
        let playerID = interaction.member.id
        const target = args['player']
        const encounters: Encounter[] = [] 
        
        if (target !== undefined) playerID = /<@([0-9]+)>/.exec(target.value)[1]

        try {
            const { characters } = (await fetchPlayer(playerID))
            const { 
                name,
                world: server 
            } =  findMain(characters)

            const { world, region } = getRegionAndWorld(server)

            const zoneRanks = await getCharZoneRanks(name, world, region)

            for (const encounter of zoneRanks) {
                const { 
                    encounter: {
                        name
                    }, 
                    totalKills,
                    fastestKill,
                    rankPercent,
                    bestSpec,
                } = encounter

                encounters.push({
                    name,
                    totalKills,
                    fastestKill,
                    specJob: bestSpec,
                    rankNumber: Math.floor(rankPercent),
                })
            }

            interaction.createMessage({
                embeds: [
                    {
                        title: `${name} | ${world} - Top Clears`,
                        fields: [
                            ...encounters.map((encounter) => {
                                return {
                                    name: `${encounter.name} | ${encounter.totalKills > 0 ? ':white_check_mark:' : '❌'}`,
                                    value: `
Total Kills: ${encounter.totalKills}
Fastest Kill: ${encounter.fastestKill}
Best Job: ${encounter.specJob} (${encounter.rankNumber})
                                    `
                                }
                            })
                        ]
                    }
                ],
                flags: 64
            })
        } catch (_error) {
            console.log(_error)
        }
    }
})

const getRegionAndWorld = (input: string): CharacterSeverInfo => {
    const world = input.split(' ')[0]
    const region = getDCRegion(/\[([A-Za-z]+)\]/.exec(input.split(' ')[1])[1])

    return { world, region }
}