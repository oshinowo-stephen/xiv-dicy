import { getCharZoneRanks } from '@aiueb/fflogs'
import { createCommand } from '@hephaestus/eris'
import { fetchLoadstoneInfo } from '@services/character'
import { mapDCToRegion } from '@utils/gimmick'
import duration from 'format-duration'

export default createCommand({
    type: 1,
    name: 'get',
    description: 'fetch a character from fflogs',
    options: [
        {
            type: 3,
            required: true,
            name: 'character',
            description: 'character\'s name, e.g: Stone Satori'
        },
        {
            type: 3,
            required: true,
            name: 'world',
            description: 'character\'s world, e.g: Marilith'
        }
    ],
    action: async (interaction, args) => {
        const character = args['character']
        const charWorld = args['world']

        try {
            const {
                name,
                world,
                avatarUrl,
                dataCenter: dcenter
            } = await fetchLoadstoneInfo([character.value, charWorld.value])

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
                                        : 'It seems that you\'re too weak'
                                }
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
                flags: 64
            })
        } catch (_error) {
            console.log(_error)

            if (_error.message === 'No logs found.') {
                return interaction.createMessage({
                    content: 'No logs presented for this player!',
                    flags: 64
                })
            } else if (_error.message.includes('undefined (reading \'ID\')')) {
                return interaction.createMessage({
                    content: `Unable to fetch character: ${name} from ${charWorld}`,
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