import test from 'ava'
import { timeouts, createTimeout, randomString, sleep } from './index'

test('timeouts | create 2 second timeout', async (t) => {
  createTimeout('SOME_RANDOM_PERSON', 1500)
  t.is(timeouts.has('SOME_RANDOM_PERSON'),  true)

  await sleep(2000)

  t.is(timeouts.has('SOME_RANDOM_PERSON'), false)
})

test('randomString | generating a random string', (t) => {
  const string = randomString(28)

  t.is(string.length, 28)
})
