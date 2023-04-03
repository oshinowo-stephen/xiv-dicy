import { getCharZoneRanks } from '@aiueb/fflogs'
import { Event } from '@hephaestus/eris'

import { fetchAllFromPlayer, fetchLoadstoneInfo } from '@services/character'
import { mapDCToRegion, clearState, getState, setState } from '@utils/gimmick'

import duration from 'format-duration'

import { ComponentInteraction, EmbedField } from 'eris'
import { PlayerState } from '@services/player'

const event: Event = {
    name: 'interactionCreate',
    handler: async (interaction) => {
        if (interaction instanceof ComponentInteraction) {
            if (interaction.data.component_type === 2) {
                const {
                    args,
                    currentPage
                } = await getState<PlayerState>(interaction.member.id)

                const characters = await fetchAllFromPlayer(
                    args === undefined 
                        ? interaction.member.id 
                        : args
                )

                if ((currentPage - 1) >= 0 && interaction.data.custom_id === 'ipn-left') {
                    await setState({
                        user: interaction.member.id,
                        data: {
                            args,
                            currentPage: currentPage - 1
                        }
                    })
                } else if ((currentPage + 1) < characters.length && interaction.data.custom_id === 'ipn-right') {
                    await setState({
                        user: interaction.member.id,
                        data: {
                            args,
                            currentPage: currentPage + 1
                        }
                    })
                } else if (interaction.data.custom_id === 'ipn-exit') {
                    await clearState(interaction.member.id)

                    await interaction.defer(64)
                    await interaction.createFollowup({
                        content: 'Okay, exitting the prompt above!',
                        flags: 64,
                    })
                    return
                }

                const {
                    currentPage: pageNumber
                } = await getState<PlayerState>(interaction.member.id)

                console.log(pageNumber)

                const { charURI } = characters[pageNumber]

                const {
                    name,
                    world,
                    avatarUrl,
                    dataCenter: dcenter,
                } = await fetchLoadstoneInfo([charURI])

                try {
                    const ranks = await getCharZoneRanks(name, world, mapDCToRegion(dcenter))
                
                    await interaction.editParent({
                        embeds: [
                            {
                                title: `${name} | ${world}, ${dcenter}`,
                                fields: [
                                    ...ranks.map(({
                                        encounter,
                                        rankPercent,
                                        bestSpec,
                                        fastestKill,
                                        totalKills
                                    }) => {
                                        return {
                                            name: `${encounter.name} | ${totalKills !== 0 ? '✅' : '⛔'}`,
                                            value: totalKills !== 0
                                                ? `
                                                You've done your best with: ${bestSpec},
                                                clearing ${totalKills <= 1 ? 'once' : `${totalKills} times`} with a (${rankPercent}%),
                                                and **\`${duration(fastestKill)}\`** being your fastest!
                                                `
                                                : 'It seems that you\'re too weak.',
                                        } as EmbedField
                                }) 
                                ],
                                thumbnail: {
                                    url: avatarUrl
                                },
                                image: {
                                    url: 'https://ffxiv.consolegameswiki.com/mediawiki/images/6/66/Abyssos_The_Eighth_Circle.png'
                                }
                            }
                        ]
                    })
                }  catch ({ message: errMsg }) {
                    if (errMsg === 'No logs found.') {
                        await interaction.editParent({
                            embeds: [
                                {
                                    title: `${name} | ${world}, ${dcenter}`,
                                    description: 'This character doesn\'t seem to be in the current tier at the moment',
                                    thumbnail: {
                                        url: avatarUrl
                                    }
                                }
                            ]
                        })
                    }
                }
            }
        }
    }
}

export default event