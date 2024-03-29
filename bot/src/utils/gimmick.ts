import { Member } from 'eris'
import { logger } from '@hephaestus/utils'

import { createClient } from 'redis'
import config from 'config'

const { NODE_ENV } = process.env

interface UserState<T> {
    user: string
    data: T
}

const client = createClient({
    password: NODE_ENV !== 'prod'
        ? undefined
        : config.get('REDIS_PASSWORD'),
    socket: {
        host: NODE_ENV !== 'prod'
            ? undefined
            : 'cache',
        port: NODE_ENV !== 'prod'
            ? 6379
            : config.get('REDIS_PORT')
    }
})

export async function setState<T>(state: UserState<T>) {
    await client.set(state.user, JSON.stringify(state.data))
}

export async function getState<T>(user: string): Promise<T> {
    const stateData = await client.get(user)

    return JSON.parse(stateData) as T
}

export async function clearState(user: string): Promise<void> {
    await client.del(user)
}

client.on('error', (error) => {
    if (error) {
       logger.error(`An error has occurred with redis: ${error}`) 
    }
})

client.connect().catch((err) => {
    console.log('unable to connect to redis:', err)
})

export const checkForRole = (player: Member, role: string): boolean =>
    player.roles.indexOf(role) !== -1

export const mapDCToRegion = (dc: string): string => {
    switch(dc.toLowerCase()) {
        case 'aether':
        case 'primal':
        case 'crystal':
        case 'dynamis':
            return 'na'
        default:
            return 'na'
    }
}