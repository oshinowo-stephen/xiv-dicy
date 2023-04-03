import { verifyCharacter } from '@aiueb/verify'
import { 
    Character,
    PrismaClient 
} from '@prisma/client'
import { logger } from '@hephaestus/utils'
import {
    getCharFromName,
    CharacterDetails as LoadstoneDetails,
    getCharFromID,
} from '@aiueb/loadstone'
import { sleep } from '@aiueb/utils'

import { URL } from 'url'

const storage: PrismaClient = new PrismaClient()
export const PROFILE_REGEX: RegExp = /https:\/\/na\.finalfantasyxiv\.com\/lodestone\/character\/([0-9]+)\//gm

export const store = async (character: Character): Promise<void> => {
    await storage.character.create({
        data: {
            ...character
        }
    })
}

export const remove = async (character: Character): Promise<void> => { 
    await storage.character.delete({
        where: {
            charID: character.charID
        }
    })
}

export const fetch = async (world: string, name: string): Promise<Character> =>
    await storage.character.findFirst({
        where: {
            name,
            world, 
        }
    })

export const fetchAllFromPlayer = async (playerID: string): Promise<Character[]> =>
    await storage.character.findMany({
        where: {
            playerID,
        }
    })

export const fetchLoadstoneInfo = async (params: [string, string?]): Promise<LoadstoneDetails> => {
    if (params[1] === undefined) {
        const { pathname } = new URL(params[0])
        const charID = pathname.split('/').filter((str) => str.length !== 0)[2]

        console.log(charID)

        if (charID.length >= 1) {
            return (await getCharFromID(charID)) as LoadstoneDetails
        } else {
            throw new Error('don\'t know what to do this')
        }
    } else {
        console.log(params)

        return (await getCharFromName(params[0], params[1])) as LoadstoneDetails
    }
}

export const isVerified = async (world: string, character: string): Promise<void> => {
    if (!await fetch(world, character)) {
        return undefined
    } else {
        throw new Error('Already verified!')
    }
}

export const tryToVerify = (character: string, key: string, tryCount: number = 0): Promise<void> => 
    new Promise((resolve, reject) => {
        verifyCharacter(key, character)
            .then((_) => resolve())
            .catch((err) => {
                if (err) logger.error('Unable to verify character, reason: ', err)

                console.log(tryCount)
                if ((tryCount + 1) >= 10) {
                    return reject('Maximum tries reached.')
                }

                sleep(5000).then((_) => resolve(tryToVerify(character, key, (tryCount + 1))))
            })
    })
