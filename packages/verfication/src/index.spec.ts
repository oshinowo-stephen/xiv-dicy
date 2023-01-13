import { verifyCharacter } from './index'

test('verify character', () => {
    const testKey = 'SOMR_RANDOM_TEST_KEY'

    verifyCharacter(testKey, 'https://na.finalfantasyxiv.com/lodestone/character/36433039/')
})