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

export default createCommand({
    type: 1,
    name: 'add',
    description: 'Add your character to your profile!',
    options: [
        {
            type: 3,
            required: true,
            name: 'loadstone-url',
            description: 'character\'s loadstone url!'
        }
    ],
    action: async (interaction, args): Promise<void> => {
        const playerID = interaction.member.id
        const loadstone = args['loadstone-url'].value
        const secretKey = `dicy-${randomString(28)}`

        if (timeouts.has(interaction.member.id)) return interaction.createMessage({
            content: '✋ Hold on, you\'re already in process of this command already!',
            flags: 64
        })

        createTimeout(playerID, 50 * 1000)

        if (!(await getPlayer(playerID))) {
            logger.warn('Unable to locate this player... inserting:', playerID, 'into the database.')

            await storePlayer(playerID)
        }

        try {
            const { 
                name, 
                world,
                dataCenter: dcenter
            } = await fetchLoadstoneInfo(loadstone)

            try {
                await isVerified(world, name)
            
                interaction.createMessage({
                    content: `
Take this:
\`${secretKey}\`
Then place it here:
https://na.finalfantasyxiv.com/lodestone/my/setting/profile/
                    `,
                    flags: 64
                })

                try {
                    await tryToVerify(loadstone, secretKey)

                    await storeCharacter({
                        name,
                        world,
                        dcenter,
                        playerID,
                        charURI: loadstone,
                        charID: randomString(56),
                    })
                    .catch((error) => {
                        interaction.createMessage({
                            content: `
Ah i've ran into an issue...
\`\`\`
${error}
\`\`\`
Report this... 
                            `,
                            flags: 64
                        })

                        deleteTimeout(playerID)
                    })
                    .then((_) => {
                        interaction.createMessage({
                            content: `${name} on ${world} | ${dcenter}, now belongs to you!`,
                            flags: 64
                        })

                        deleteTimeout(playerID)
                    })
                } catch (_error) {
                    if (_error.message === 'Maximum tries reached.') {
                        interaction.createMessage({
                            content: 'Maxium tries reached! Please try again.',
                            flags: 64,
                        })
                    } else {
                        interaction.createMessage({
                            content: `
This wasn't supposed to happen, please report this:
\`\`\`
${_error}
\`\`\`
                            `
                        })
                    }

                    deleteTimeout(playerID)
                }
            } catch (_error) {
                return interaction.createMessage({
                    content: `${name} from ${world} | ${dcenter} is already verified.`,
                    flags: 64
                })
                
            }
        } catch (_error) {
            if (_error.message.includes('Not Found | 404')) {
                interaction.createMessage({
                    content: 'Invalid Character!',
                    flags: 64
                })
            } else {
                interaction.createMessage({
                    content: '... You\'re doing something you\'re not supposed to...',
                    flags: 64
                })
            }

            deleteTimeout(playerID)
        }
    }
})