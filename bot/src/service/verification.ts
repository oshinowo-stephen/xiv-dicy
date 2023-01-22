import { sleep } from '@aiueb/utils'
import { verifyCharacter } from '@aiueb/verify'

interface Character {
    name: string
    world: string
}

export const isValidProfile = (input: string) =>
    /https:\/\/na\.finalfantasyxiv\.com\/lodestone\/character\/([0-9]+)/gm
    .test(input)

export const tryToVerify = async (key: string, url: string, tries: number): Promise<Character> => {
    try {
        const { 
            name, 
            world 
        } = await verifyCharacter(key, url) 
        
        console.log('trying to verify')

        return { name, world }
    } catch (_error) {
        console.log(_error.message)

        if (_error.message === 'Invalid Character.') {
            throw new Error('Invalid Character!')
        }

        console.log('current tries: ', tries)

        if (tries++ >= 10) {
            throw new Error('Maximum tries reached.')
        }

        await sleep(5000)

        return tryToVerify(key, url, (tries++))
    }
}
