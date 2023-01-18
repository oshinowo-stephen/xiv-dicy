import test from 'ava'

import { loadTokenToEnv } from './'

test('token in env?', async (t) => {
    await loadTokenToEnv()

    t.truthy(process.env.FF_LOGS_TOKEN !== undefined)
})