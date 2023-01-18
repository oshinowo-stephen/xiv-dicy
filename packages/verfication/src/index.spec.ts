import test from 'ava'

import { verifyCharacter } from './index'

test('verify character', async (t) => {
    const key = 'SOME_RANDOM_TEST_KEY'

    await verifyCharacter(key, 'https://na.finalfantasyxiv.com/lodestone/character/45803813/')

    t.pass('just passing this for now...')
})
