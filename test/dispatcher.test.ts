import test from 'ava'

import { Dispatcher, IDispatcher, createDispatcherContext } from '../src'
import { createContext } from './helper'

test('create new dispatcher', t => {
  t.notThrows(() => new Dispatcher())
})

test('`new dispatcher` should throw when instanciated with wrong options', t => {
  // @ts-ignore
  t.throws(() => new Dispatcher('lol'), {
    message:
      'Expected `options` to be of type `object` but received type `string`'
  })
})

test('should add middleware internally', t => {
  const dispatcher = new Dispatcher()

  // @ts-ignore
  t.is(dispatcher.middleware.length, 0)

  dispatcher.use(() => {})

  // @ts-ignore
  t.is(dispatcher.middleware.length, 1)
})

test('dispatcher instance should be included in state', t => {
  const dispatcher = new Dispatcher()

  // @ts-ignore
  const context = createContext({
    content: 'hello'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  t.is(context.state.dispatcher.dispatcher, dispatcher)
})

test('cannot add middleware when dispatcher is already started', t => {
  const dispatcher = new Dispatcher()

  // @ts-ignore
  dispatcher._started = true

  t.throws(() => dispatcher.use(() => {}), {
    message: 'cannot add middleware when dispatcher already started'
  })
})
