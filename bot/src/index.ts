import { Hephaestus as Forge } from '@hephaestus/eris'
import { loadTokenToEnv } from '@aiueb/auth'
import { logger } from '@hephaestus/utils'
import { join as __join } from 'path'
import '@utils/loader'
import config from 'config'

const main = async (): Promise<void> => {
    await loadTokenToEnv()

    const dicy = new Forge(config.get('BOT_TOKEN'), {
        maxShards: 'auto',
        getAllUsers: false,
        intents: [
            'guilds',
            'guildMessages',
        ]
    })

    dicy.client.on('ready', () => {
        logger.info(`${dicy.client.user.username} is now online!`)
    })

    dicy.commands.forge(__join(__dirname, 'commands'))
    dicy.events.forge(__join(__dirname, 'events'))
    await dicy.connect()
    logger.info('App connecting to the DiscordAPI...')
}

main().catch(console.error)