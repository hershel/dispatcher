import test from 'ava'

import { createTestContext } from '../dispatcher.helper'
import { Dispatcher } from '../../src'

test('should returns false for bot user', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const context = createTestContext({
    message: { content: 'hello', author: { bot: true } }
  })

  t.false(dispatcher.shouldHandle(context))
})

test('should returns false for message from current user', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const context = createTestContext({
    message: { content: 'hello', author: { id: '0' } },
    app: { id: '0' }
  })

  t.false(dispatcher.shouldHandle(context))
})

test('should returns true for others cases', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const context = createTestContext({
    message: { content: 'hello' }
  })

  t.true(dispatcher.shouldHandle(context))
})
