import { ComponentInteraction } from 'eris'
import { getCharZoneRanks } from '@aiueb/fflogs'
import { createCommand } from '@hephaestus/eris'

import duration from 'format-duration'

import { mapDCToRegion } from '@utils/gimmick'
import { fetchAllFromPlayer, fetchLoadstoneInfo } from '@services/character'

export default createCommand({
    type: 1,
    name: 'list',
    description: 'List your or other\'s... character\'s clears and performance!',
    options: [
        {
            type: 3,
            required: false,
            name: 'member',
            description: 'the person you wanna see'
        }
    ], 
    action: async (interaction, args, { client }) => {
        let playerID = interaction.member.id

        if (args['member']) {
            playerID = args['member'].value
        }

        console.log(playerID)

        const characters = await fetchAllFromPlayer(playerID)

        let currentPage: number = 0
        let currentCharacter = characters[currentPage]

        console.log(characters)

        const {
            name,
            world,
            avatarUrl,
            dataCenter,
            // portraitUrl,
        } = await fetchLoadstoneInfo(currentCharacter.charURI)

        try {
            const zoneRanks = await getCharZoneRanks(name, world, mapDCToRegion(dataCenter))

            client.on('interactionCreate', async (interacted) => {
                if (!(interacted instanceof ComponentInteraction)) return

                if (interacted.data.component_type === 2) {
                    console.log('clicked a button')

                    if (interacted.data.custom_id === 'next-page') {
                        console.log('clicked next page')
                        // interacted.message.embeds

                        currentPage = currentPage === characters.length
                            ? characters.length
                            : currentPage + 1
                        

                        currentCharacter = characters[currentPage]
                        console.log(currentPage)
                        console.log(currentCharacter)

                        const {
                            name,
                            world,
                            avatarUrl,
                            dataCenter,
                            // portraitUrl,
                        } = await fetchLoadstoneInfo(currentCharacter.charURI)

                        console.log(name, world, mapDCToRegion(dataCenter))

                        try {
                         const zoneRanks = await getCharZoneRanks(name, world, mapDCToRegion(dataCenter))
                            
                        interacted.editParent({
                embeds: [
                    {
                        title: `${name} in ${world} | ${dataCenter}`,
                        fields: zoneRanks.map((zone) => {
                            return {
                                name: `${zone.encounter.name} | ${zone.totalKills > 0 ? '✔️' : '🚫'}`,
                                value: zone.totalKills > 0 ? `
    Best kill on: ${zone.bestSpec}!
    Current ranking: ${zone.rankPercent}
    Fastest kill time: ${duration(zone.fastestKill)}
    Cleared ${zone.totalKills === 1 ? 'Once' : `${zone.totalKills} times`}!
                                `
                                :
                                'Didn\'t cleared yet... it seems...'
                            }
                        }),
                        thumbnail: {
                            url: avatarUrl,
                        }
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: '❌',
                                custom_id: 'exit',
                                style: 4,
                            },
                            {
                                type: 2,
                                label: '⬅️',
                                custom_id: 'previous-page',
                                style: 1,
                            },
                            {
                                type: 2,
                                label: '➡️',
                                custom_id: 'next-page',
                                style: 1
                            }
                        ]
                    }
                ],
                        })                           
                        } catch (_error) {
                            if (_error instanceof TypeError) {
                                interacted.createMessage({
                                    content: `${name} on ${world} | ${dataCenter}, doesn't seem to have any instances on their record.`,
                                    flags: 64
                                })
                            }
                        }

                    } else if (interacted.data.custom_id === 'exit') {

                        currentCharacter = characters[currentPage]

                        interacted.editParent({
                            embeds: interacted.message.embeds
                        })

                    } else if (interacted.data.custom_id === 'previous-page') {
                        currentPage = currentPage === 0
                            ? currentPage
                            : currentPage - 1
                        currentCharacter = characters[currentPage]

                        const {
                            name,
                            world,
                            avatarUrl,
                            dataCenter,
                            // portraitUrl,
                        } = await fetchLoadstoneInfo(currentCharacter.charURI)

                        const zoneRanks = await getCharZoneRanks(name, world, mapDCToRegion(dataCenter))
                       
                        interacted.editParent({
                embeds: [
                    {
                        title: `${name} in ${world} | ${dataCenter}`,
                        fields: zoneRanks.map((zone) => {
                            return {
                                name: `${zone.encounter.name} | ${zone.totalKills > 0 ? '✔️' : '🚫'}`,
                                value: zone.totalKills > 0 ? `
    Best kill on: ${zone.bestSpec}!
    Current ranking: ${zone.rankPercent}
    Fastest kill time: ${duration(zone.fastestKill)}
    Cleared ${zone.totalKills === 1 ? 'Once' : `${zone.totalKills} times`}!
                                `
                                :
                                'Didn\'t cleared yet... it seems...'
                            }
                        }),
                        thumbnail: {
                            url: avatarUrl,
                        }
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: '❌',
                                custom_id: 'exit',
                                style: 4,
                            },
                            {
                                type: 2,
                                label: '⬅️',
                                custom_id: 'previous-page',
                                style: 1,
                            },
                            {
                                type: 2,
                                label: '➡️',
                                custom_id: 'next-page',
                                style: 1
                            }
                        ]
                    }
                ],
                        })
                        

                    } else {

                    }
                }
            })

            await interaction.createMessage({
                embeds: [
                    {
                        title: `${name} in ${world} | ${dataCenter}`,
                        fields: zoneRanks.map((zone) => {
                            return {
                                name: `${zone.encounter.name} | ${zone.totalKills > 0 ? '✔️' : '🚫'}`,
                                value: zone.totalKills > 0 ? `
    Best kill on: ${zone.bestSpec}!
    Current ranking: ${zone.rankPercent}
    Fastest kill time: ${duration(zone.fastestKill)}
    Cleared ${zone.totalKills === 1 ? 'Once' : `${zone.totalKills} times`}!
                                `
                                :
                                'Didn\'t cleared yet... it seems...'
                            }
                        }),
                        thumbnail: {
                            url: avatarUrl,
                        }
                    }
                ],
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: '❌',
                                custom_id: 'exit',
                                style: 4,
                            },
                            {
                                type: 2,
                                label: '⬅️',
                                custom_id: 'previous-page',
                                style: 1,
                            },
                            {
                                type: 2,
                                label: '➡️',
                                custom_id: 'next-page',
                                style: 1
                            }
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