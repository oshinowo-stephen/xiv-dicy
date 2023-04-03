import { 
    Player,
    PrismaClient, 
} from '@prisma/client'

const storage: PrismaClient = new PrismaClient()

export const PLAYER_REGEX: RegExp = /<@([0-9]+)>/gm

export interface PlayerState {
    args?: string
    currentPage: number
}

export const remove = async (player: string): Promise<void> => {
    await storage.player.delete({
        where: {
            id: player
        }
    })
}

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