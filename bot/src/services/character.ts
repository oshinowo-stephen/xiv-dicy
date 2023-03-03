import { verifyCharacter } from '@aiueb/verify'
import { 
    Character,
    PrismaClient 
} from '@prisma/client'
import { logger } from '@hephaestus/utils'
import {
    getCharacter,
    CharacterDetails as LoadstoneDetails,
} from '@aiueb/loadstone'
import { sleep } from '@aiueb/utils'

import { URL } from 'url'

const storage: PrismaClient = new PrismaClient()
// const PROFILE_REGEX: RegExp = /https:\/\/na\.finalfantasyxiv\.com\/lodestone\/character\/([0-9]+)\//gm

export const store = async (character: Character): Promise<void> => {
    await storage.character.create({
        data: {
            ...character
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

export const fetchLoadstoneInfo = async (loadstoneURL: string): Promise<LoadstoneDetails> => {
    const { pathname } = new URL(loadstoneURL)

    console.log(pathname.split('/').filter((str) => str.length !== 0))

    const charID = pathname.split('/').filter((str) => str.length !== 0)[2]

    console.log(loadstoneURL)
    console.log(charID)

    if (charID.length >= 1) {
        return (await getCharacter(charID)) as LoadstoneDetails
    } else {
        throw new Error('don\'t know what to do this')
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
