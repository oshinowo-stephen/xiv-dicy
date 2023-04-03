import { logger } from '@hephaestus/utils'
import { createCommand } from '@hephaestus/eris'

import { remove as removePlayer } from '@services/player'
import { fetchAllFromPlayer, remove as removeCharacter } from '@services/character'

export default createCommand({
    type: 1,
    name: 'remove',
    options: [
        {
            type: 3,
            name: 'name',
            // autocomplete: true,
            // autocompleteAction: async (interaction) => {
            //     const player = interaction.member.id
            //     const chars = await fetchAllFromPlayer(player)

            //     await interaction.result()
            // },
            description: 'Character\'s name',
            required: true 
        },
        {
            type: 3,
            name: 'world',
            // autocomplete: true,
            // autocompleteAction: async (interaction) => {
            //     const player = interaction.member.id
            //     const chars = await fetchAllFromPlayer(player)
            // },
            description: 'Character\'s world',
            required: true
        },
    ],
    description: 'Remove provided character from your profile',
    action: async (interaction, args) => {
        const name = args['name'].value
        const world = args['world'].value
        const player = interaction.member.id

        console.log(name)
        console.log(world)

        try {
            const characters = await fetchAllFromPlayer(player)

            if (characters.length === 0) {
                return interaction.createMessage({
                    content: 'You haven\'t add any characters yet...',
                    flags: 64
                })
            }
        
            const character = characters.find((char) => 
                char.name.toLowerCase() === name.toLowerCase() && 
                char.world.toLowerCase() === world.toLowerCase())

            console.log(character)

            if (character !== undefined) {
                await removeCharacter(character)

                const characters = await fetchAllFromPlayer(player)

                if (characters.length === 0) {
                    logger.warn('Removing player no more characters in his profile!')

                    await removePlayer(player)
                }

                await interaction.createMessage({
                    content: `Successfully removed character: ${character.name} | ${world}`,
                    flags: 64
                })
            } else {
                await interaction.createMessage({
                    content: `There's no ${name} | ${world} from your profile.`,
                    flags: 64
                })
            }
        } catch (_error) {
            console.log(_error)
        }
    }
})