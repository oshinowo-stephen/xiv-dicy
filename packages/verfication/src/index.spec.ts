import test from 'ava'

import { verifyCharacter } from './index'

test('verify character', async (t) => {
    const key = 'SOME_RANDOM_TEST_KEY'

    const {
        name,
        world
    } = await verifyCharacter(key, 'https://na.finalfantasyxiv.com/lodestone/character/43637261/')

    t.is(name, 'Questing Marshmellow')
    t.is(world, 'Sophia [Materia]')
})
