import { createCommand } from '@hephaestus/eris'

export default createCommand({
    type: 1,
    name: 'clears',
    description: 'Lists own or provided player\'s recent clears',
    action: async (interaction, _args): Promise<void> => {
        interaction.createMessage('N/A')
    }
})