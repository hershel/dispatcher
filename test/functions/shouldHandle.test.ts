import test from 'ava'

import { Dispatcher, IDispatcher } from '../../src'
import { createContext } from '../helper'

test('should returns false for bot user', t => {
  const dispatcher = new Dispatcher()

  // @ts-ignore
  const context = createContext({
    content: 'hello !'
  }) as IDispatcher.Context

  context.message.author.bot = true

  t.false(dispatcher.shouldHandle(context))
})

test('should returns false for message from current user', t => {
  const dispatcher = new Dispatcher()

  // @ts-ignore
  const context = createContext({
    content: 'hello !'
  }) as IDispatcher.Context

  context.message.author.id = '0'
  context.app.user.id = '0'

  t.false(dispatcher.shouldHandle(context))
})

test('set custom should handle function', t => {
  const dispatcher = new Dispatcher()

  const noop = () => true
  dispatcher.setCustomShouldHandle(noop)

  t.is(dispatcher.shouldHandle, noop)
})
