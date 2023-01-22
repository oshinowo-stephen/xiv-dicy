import { createCommand } from '@hephaestus/eris'

import { 
    Character,
    fetchPlayer,
} from '../../service'

export default createCommand({
    type: 1,
    name: 'list',
    description: 'List your current or a player\'s characters!',
    options: [
        {
            type: 3,
            required: false,
            name: 'player',
            description: 'Player Tag/ID'
        }
    ],
    action: async (interaction, args): Promise<void> => {
        let characters: Character[] = []
        const target = args['player']
        let playerID = interaction.member.id 

        if (target !== undefined) playerID = /<@([0-9]+)>/.exec(target.value)[1]
       
        try {
            characters = (await fetchPlayer(playerID)).characters
        } catch (_error) {
            console.log(_error)

            return interaction.createMessage({
                content: 'I think we ran into an issue'
            })
        }

        interaction.createMessage({
            embeds: [
                {
                    fields: characters.map((character) => {
                        console.log(character)
                        
                        return {
                            name: `-- ${character.priority === 0 ? 'Primary' : 'Alternate'} Character : ${character.name} -- `,
                            value: `
                            [Direct Link!](${character.charURI}) | ${character.world} 
                            `,
                        }
                    })
                }
            ]
        })
    }
})