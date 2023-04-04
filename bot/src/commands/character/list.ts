import { getCharZoneRanks } from '@aiueb/fflogs'
import { createCommand } from '@hephaestus/eris'
// import { logger } from '@hephaestus/utils'

import duration from 'format-duration'

import { mapDCToRegion, setState } from '@utils/gimmick'
import { fetch as fetchPlayer, PlayerState, PLAYER_REGEX } from '@services/player'
import { fetchAllFromPlayer, fetchLoadstoneInfo } from '@services/character'
import { EmbedField } from 'eris'
import { timeouts, createTimeout, deleteTimeout } from '@aiueb/utils'

export default createCommand({
    type: 1,
    name: 'list',
    options: [
        {
            type: 3,
            name: 'player',
            description: 'Player\'s ID or simply @ em\'',
            required: false,
        }
    ],
    description: 'List characters\' clears and performance!',
    action: async (interaction, args) => {
        let playerID = interaction.member.id
        const target = args['player'] !== undefined
            ? args['player'].value
            : undefined

        if (timeouts.has(interaction.member.id)) {
            return interaction.createMessage({
                content: 'This command is already in action, please wait.',
                flags: 64
            })
        }

        createTimeout(interaction.member.id, 5)
        console.log(target)

        if (target !== undefined && !PLAYER_REGEX.test(target)) {
            deleteTimeout(interaction.member.id)

            return interaction.createMessage({
                content: 'Invalid Player: ' + target + '.',
                flags: 64
            })
        }

        if (target !== undefined) {
            console.log(PLAYER_REGEX.exec(target))
            playerID = PLAYER_REGEX.exec(target)[1]
        }

        await setState<PlayerState>({
            user: interaction.member.id,
            data: {
                args: playerID,
                currentPage: 0
            }
        })


        try {
            const characters = await fetchAllFromPlayer(playerID)

            if (characters.length === 0 || (await fetchPlayer(playerID)) === undefined) {
                return interaction.createMessage({
                    content: `No profile or characters found for user: <@${playerID}>`,
                    flags: 64
                })
            }

            const { 
                name,
                world,
                avatarUrl,
                dataCenter: dcenter,
            } = await fetchLoadstoneInfo([characters[0].charURI])  

            const ranks = await getCharZoneRanks(name, world, mapDCToRegion(dcenter))

            await interaction.createMessage({
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
                ],
                components: characters.length > 1 ? [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                label: '◀️',
                                custom_id: 'ipn-left',
                                style: 1,
                            },
                            {
                                type: 2,
                                label: '▶️',
                                custom_id: 'ipn-right',
                                style: 1,
                            },
                            {
                                type: 2,
                                label: '🚫',
                                custom_id: 'ipn-exit',
                                style: 4,
                            }
                        ]
                    }
                ] : 
                [],
                flags: 64,
            })
        } catch (_error) {
            console.log(_error)

            if (_error.message === 'No logs found.') {
                return interaction.createMessage({
                    content: 'No logs presented for this player!',
                    flags: 64
                })
            } else {
                return interaction.createMessage({
                    content: `
Unable to return a valid response, reason being:
\`\`\`
${_error.message}
\`\`\`
Please report this to: Stonic#9086
                    `,
                    flags: 64
                })
            }
        }
    }
})