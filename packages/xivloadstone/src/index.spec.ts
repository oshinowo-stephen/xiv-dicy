import test from 'ava'

import { getCharacter } from './index'

test('grab character info: [ name ]', async (t) => {
    const character = await getCharacter('45803813')
    console.log(character)

    t.is(character.name, 'Ice Wallow')    
})

test('grab invalid character', async (t) => {
    await t.throwsAsync(getCharacter('sdasdasdasdasd'))
})