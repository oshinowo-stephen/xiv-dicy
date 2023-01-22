import test from 'ava'

import { verifyCharacter } from './index'

test('invalid character', async (t) => {
    await t.throwsAsync(
        verifyCharacter('RANDOM_TEST_KEY', 'https://na.finalfantasyxiv.com/lodestone/character/00340204240121/'),
        {
            instanceOf: Error,
            message: 'Invalid Character.'
        }
    )
})

test('verify character', async (t) => {
    const key = 'SOME_RANDOM_TEST_KEY'

    const {
        name,
        world
    } = await verifyCharacter(key, 'https://na.finalfantasyxiv.com/lodestone/character/43637261/')

    t.is(name, 'Questing Marshmellow')
    t.is(world, 'Sophia [Materia]')
})
