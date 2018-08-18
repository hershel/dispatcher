import test from 'ava'

import { Dispatcher, IDispatcher, createDispatcherContext } from '../../src'
import * as commands from '../command.helper'
import { createContext } from '../helper'

test('should extract command from content', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.TestCommand()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  const { dispatcher: d } = context.state

  t.is(d.command.name, 'test')
  t.is(d.command.command, command)
})

test('should be skipped if prefix is not detected', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.TestCommand()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: 'hello'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  const { dispatcher: d } = context.state

  t.is(d.command.command, null)
  t.is(d.command.name, null)
  t.false(d.prefix.detected)
})

test('should work with prefix without command', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.NoArgument()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  const { dispatcher: d } = context.state

  t.is(d.command.command, null)
  t.is(d.command.name, null)

  t.is(d.prefix.detected, true)
  t.is(d.prefix.name, '!')
  t.is(d.prefix.length, 1)
})

test('set custom extract command function', t => {
  const dispatcher = new Dispatcher()

  const noop = () => {}
  dispatcher.setCustomExtractCommand(noop)

  t.is(dispatcher.extractCommand, noop)
})
