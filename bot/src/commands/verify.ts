import { createCommand } from '@hephaestus/eris'
import { generateSecretKey } from '@aiueb/utils'
import { verifyCharacter } from '@aiueb/verify'

const tryToVerify = async (key: string, url: string, tries: number): Promise<void> => {
    const tryCount = tries + 1

    try {
        await verifyCharacter(key, url)
    } catch(_error) {
        if (tryCount > 10) {
            throw new Error('Unable to verify this character!')
        }

        setTimeout(async () => {
            await tryToVerify(key, url, tryCount)
        }, 5000)
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
        let tries: number = 0
        const key = generateSecretKey()

        interaction.createMessage({
            content: `
Key generated: \`${key}\`, paste this in your character bio!
            `,
            flags: 64,
        })

        try {
            await tryToVerify(key, args['char_link'].value, tries)

            interaction.createMessage('Character verified!')
        } catch(_error) {
            interaction.createMessage(_error)
        }
    }
})