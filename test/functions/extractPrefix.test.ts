import test from 'ava'

import { Dispatcher, IDispatcher, createDispatcherContext } from '../../src'
import { createContext } from '../helper'

test('should extract prefix', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  // @ts-ignore
  const context = createContext({
    content: '!hello'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)

  const { dispatcher: d } = context.state

  t.true(d.prefix.detected)
  t.is(d.prefix.name, '!')
  t.is(d.prefix.length, 1)
})

test('should not extract prefix when prefix is not at the begining', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  // @ts-ignore
  const context = createContext({
    content: 'hello !hello'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)

  const { dispatcher: d } = context.state

  t.false(d.prefix.detected)
  t.is(d.prefix.name, null)
  t.is(d.prefix.length, NaN)
})

test('set custom extract prefix function', t => {
  const dispatcher = new Dispatcher()

  const noop = () => {}
  dispatcher.setCustomExtractPrefix(noop)

  t.is(dispatcher.extractPrefix, noop)
})
