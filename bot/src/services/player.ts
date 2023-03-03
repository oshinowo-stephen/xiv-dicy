import { 
    Player,
    PrismaClient, 
} from '@prisma/client'

const storage: PrismaClient = new PrismaClient()

export const fetch = async (player: string): Promise<Player> =>
    await storage.player.findUnique({
        where: {
            id: player
        }
    })

export const create = async (player: string): Promise<void> => {
    await storage.player.create({
        data: {
           id: player,
        }
    })
}