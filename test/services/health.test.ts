import { test } from 'tap'
import { build } from '../helper'

test('default root route', async (t) => {
  const app = build(t)

  const res = await app.inject({
    url: '/health',
  })
  t.deepEqual(JSON.parse(res.payload), { status: 'UP' })
})
