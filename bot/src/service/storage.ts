import { PrismaClient } from '@prisma/client'
const storage = new PrismaClient()

export interface Player {
    id: string
    characters: Character[]
}

export interface Character {
    name: string
    world: string
    charURI: string
    priority?: number   
}

export const createPlayerIfNotExists = async (player: string): Promise<void> => { 
    try {
        await fetchPlayer(player)
    } catch (_error) {
        await storage.player.create({
            data: {
                id: player
            }
        })
    }
}

export const fetchPlayer = async (player: string): Promise<Player> => {
    const { id } = await storage.player.findUnique({ where: { id: player } })
    const characters = await storage.character.findMany({ where: { playerID: player } })

    return { id, characters } as unknown as Player
}

export const storeCharacter = async (player: string, char: Character): Promise<void> => {
    const characters = await storage.character.findMany({ where: { playerID: player } })

    await storage.character.create({
        data: {
            name: char.name,
            playerID: player,
            world: char.world,
            charURI: char.charURI,
            priority: char.priority === undefined 
                ? characters.length >= 1 
                    ? characters[characters.length - 1].priority + 1
                    : 0
                : char.priority
        }
    })
}

export const fetchCharacter = async (player: string, charName?: string, url?: string): Promise<Character> => {
    const {
        name,
        world,
        priority,
        charURI
    } = await storage.character.findFirst({ where: { 
            playerID: player, 
            name: charName,
            charURI: url,
        } 
    })

    return { name, world, priority, charURI }
}

