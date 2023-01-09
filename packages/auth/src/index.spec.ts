import { loadTokenToEnv } from './'

test('token in env?', async () => {
    await loadTokenToEnv()

    expect(process.env.FF_LOGS_TOKEN !== undefined)
        .toBeTruthy()
})