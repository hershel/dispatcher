import test from 'ava'

import { createTestContext } from '../dispatcher.helper'
import { Dispatcher } from '../../src'

test('should extract prefix correctly', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const context = createTestContext({
    message: { content: '!hello' }
  })

  dispatcher.extractPrefix(context)

  const { prefix } = context.state.dispatcher

  t.true(prefix.detected)
  t.is(prefix.content, '!')
  t.is(prefix.length, 1)
})

test('should extract prefix when several prefixes are given', t => {
  const dispatcher = new Dispatcher({
    prefix: ['?', '!', '§']
  })

  const context = createTestContext({
    message: { content: '§hello' }
  })

  dispatcher.extractPrefix(context)

  const { prefix } = context.state.dispatcher

  t.true(prefix.detected)
  t.is(prefix.content, '§')
  t.is(prefix.length, 1)
})

test('should not extract prefix when prefix is not at the begining', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const context = createTestContext({
    message: { content: 'hello !hello' }
  })

  dispatcher.extractPrefix(context)

  const { prefix } = context.state.dispatcher

  t.false(prefix.detected)
  t.is(prefix.content, null)
  t.is(prefix.length, NaN)
})
