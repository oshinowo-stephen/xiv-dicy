import { createCommand } from '@hephaestus/eris'
import { logger } from '@hephaestus/utils'

import { 
    timeouts,
    randomString,
    createTimeout,
    deleteTimeout, 
} from '@aiueb/utils'

import {
    store as storeCharacter,
    isVerified,
    tryToVerify,
    fetchLoadstoneInfo,
} from '@services/character'

import {
    fetch as getPlayer,
    create as storePlayer,
} from '@services/player'
import { getCharZoneRanks } from '@aiueb/fflogs'
import { mapDCToRegion } from '@utils/gimmick'

export default createCommand({
    type: 1,
    name: 'add',
    description: 'Add your character to your profile!',
    options: [
        {
            type: 3,
            required: true,
            name: 'loadstone-url',
            description: 'character\'s loadstone url'
        }
    ],
    action: async (interaction, args): Promise<void> => {
        const player = interaction.member.id
        const key = `dicy-${randomString(28)}`
        const { value: loadstone } = args['loadstone-url']

        if (timeouts.has(player)) {
            return interaction.createMessage({
                content: 'Hold on, this command is already in process.',
                flags: 64
            })
        }

        createTimeout(player, (10 * 1000))

        if (!(await getPlayer(player))) {
            await interaction.createMessage({
                content: 'Unable locate your entries... creating a new set now...',
                flags: 64
            })

            await storePlayer(player)            
        }

        try {
            const {
                name,
                world,
                dataCenter: dcenter
            } = await fetchLoadstoneInfo([ loadstone ])

            const region = mapDCToRegion(dcenter)

            ;(await getCharZoneRanks(name, world, region))

            try {
                await isVerified(world, name)

                await interaction.createMessage({
                    content: `
Take this:
\`\`\`
${key}
\`\`\`
And place it here:
https://shorturl.at/svyFZ
                    `,
                    flags: 64
                })
            } catch (_error) {
                deleteTimeout(player)

                console.log(_error)
            }

            try {
                await tryToVerify(loadstone, key)

                await storeCharacter({
                    name,
                    world,
                    dcenter,
                    playerID: player,
                    charURI: loadstone,
                    charID: randomString(16)
                })

                deleteTimeout(player)
                
                await interaction.createMessage({
                    content: `${name} on ${world} | ${dcenter}, is now yours!`,
                    flags: 64
                })
            } catch (_error) {
                deleteTimeout(player)

                console.log(_error)
            }
        } catch (_error) {
            deleteTimeout(player)

            if (_error.message === 'No logs found.') { 
                return interaction.createMessage({
                    content: 'This character doesn\'t have any records on fflogs.',
                    flags: 64
                })
            }

            logger.error(_error)
        }
    } 
})