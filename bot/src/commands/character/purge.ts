import { sleep } from "@aiueb/utils";
import { createCommand } from "@hephaestus/eris";
import { fetchAllFromPlayer, remove } from "@services/character";

export default createCommand({
    type: 1,
    name: 'purge',
    description: 'Purges all characters from your profile',
    action: async (interaction) => {
        const player = interaction.member.id

        try {
            const characters = await fetchAllFromPlayer(player)

            if (characters.length === 0) {
                return interaction.createMessage({
                    content: 'You haven\'t add any characters yet...',
                    flags: 64
                })
            }

            for (const character of characters) {
                await sleep(500)
                
                try {
                    await remove(character)
                } catch (_error) {
                    console.log(_error)
                }
            }

            await interaction.createMessage({
                content: 'Your characters are now gone... just like that...',
                flags: 64
            })
        } catch (_error) {
            console.log(_error)
        }
    }
})