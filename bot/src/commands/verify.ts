import { createCommand } from '@hephaestus/eris'
import { verifyCharacter } from '@aiueb/verify'
import { sleep } from '@aiueb/utils'
import { generate } from 'randomstring'

const tryToVerify = async (key: string, url: string, tries: number): Promise<boolean> => {
    try {
        await verifyCharacter(key, url)

        return true
    } catch(_error) {
        const tryCount = tries + 1;

        if (tryCount >= 10) {
            return false
        } else {
            console.log(`error: ${_error}, tryCount: ${tryCount}`)

            await sleep(5000)

            return tryToVerify(key, url, tryCount)
        }
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
        const key = `aiuebxiv-${generate()}`

        interaction.createMessage({
            content: `
Key generated: \`${key}\`, paste this in your character bio!
            `,
            flags: 64,
        })

        const verified = await tryToVerify(key, args['char_link'].value, tries)

        if (!verified) {
            await interaction.createMessage({
                content: 'unable to verify character, reason: TIMED_OUT!',
                flags: 64,
            })
        } else {
            interaction.createMessage({
                content: 'character is now verified, enjoy!',
                flags: 64
            })
        }
    }
})
