import { createCommand } from '@hephaestus/eris'

import {
    createTimeout,
    randomString,
    timeouts,
    deleteTimeout,
} from '@aiueb/utils'

import { 
    tryToVerify, 
    storeCharacter,
    fetchCharacter,
    createPlayerIfNotExists,
    isValidProfile,
} from '../service'

const isVerified = async (player: string, charURL: string): Promise<boolean> => {
    try {
        await fetchCharacter(player, undefined, charURL)

        return true
    } catch(_error) {
        console.log(_error)

        return false
    }
}

export default createCommand({
    type: 1,
    name: 'verify',
    options: [
        {
            type: 3,
            required: true,
            name: 'char_link',
            description: 'character\'s link/url',
        }
    ],
    description: 'Verify your characters!',
    action: async (interaction, args): Promise<void> => {
        if (timeouts.has(interaction.member.id)) return interaction.createMessage({
            content: 'Hold on! This command is already in process!',
            flags: 64
        })

        const playerID = interaction.member.id
        const character = args['char_link'].value

        if (!isValidProfile(character)) return interaction.createMessage({
            content: 'This isn\'t a valid character... Please try a different link',
            flags: 64
        })

        const verified = await isVerified(playerID, character) 
        await createPlayerIfNotExists(playerID)

        if (verified) return interaction.createMessage({
            content: 'You\'ve already verified this character silly UwU',
            flags: 64
        })

        createTimeout(interaction.member.id, (50 * 1000))
        const key: string = `lyralogs-${randomString(28)}`

        interaction.createMessage({
            content: `
Alright! Here's your key: \`${key}\`. 
Please paste this in your character's profile!
Found here: https://na.finalfantasyxiv.com/lodestone/my/setting/profile/
`,
            flags: 64,
        })

        try {
            const { name, world } = await tryToVerify(key, character, 0)

            await storeCharacter(playerID, {
                name,
                world,
                charURI: character
            }).catch((err) => {
                interaction.createMessage({
                    content: `
That might be a problem... Please report this to my master (<@229651386223034368>):
\`\`\`
${err}
\`\`\` 
                    `,
                    flags: 64
                })
            })

            deleteTimeout(playerID)

            interaction.createMessage({
                content: `Validated: **"${name}"** from **"${world}"**`,
                flags: 64
            })
        } catch (_error) {
            console.log(_error)

            deleteTimeout(playerID)

            interaction.createMessage({
                content: `Sorry but I was unable to verify this character, reason: \`${_error}\``,
                flags: 64,
            })
        }
    }
})
