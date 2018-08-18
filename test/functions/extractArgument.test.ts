import test from 'ava'

import { Dispatcher, IDispatcher, createDispatcherContext } from '../../src'
import * as commands from '../command.helper'
import { createContext } from '../helper'

test('should be skipped if command is null', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.TestCommand()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!hello'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)

  t.true(context.state.dispatcher.prefix.detected)

  dispatcher.extractArgument(context)

  const { dispatcher: d } = context.state

  t.is(d.command.command, null)
  t.is(d.command.name, null)

  t.deepEqual(d.argument.keys, [])
  t.deepEqual(context.params, {})
})

test('should be skipped if prefix is null', t => {
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

  t.is(context.state.dispatcher.command.command, command)

  context.state.dispatcher.prefix.detected = false

  dispatcher.extractArgument(context)

  const { dispatcher: d } = context.state

  t.deepEqual(d.argument.keys, [])
  t.deepEqual(context.params, {})
})

test('should extract all arguments', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.TestCommand()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!test hello'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)
  dispatcher.extractArgument(context)

  const { dispatcher: d } = context.state
  const { params } = context

  t.deepEqual(params, { testname: 'hello' })
  t.deepEqual(d.argument.keys[0].name, 'testname')
})

test('should work with command without argument', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.NoArgument()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)
  dispatcher.extractArgument(context)

  const { dispatcher: d } = context.state

  t.deepEqual(d.argument.keys, [])
  t.deepEqual(context.params, {})
})

test('should work with extra argument', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.TestCommand()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!test hello world im here'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)
  dispatcher.extractArgument(context)

  const { dispatcher: d } = context.state
  const { params } = context

  t.deepEqual(params, { testname: 'hello' })
  t.deepEqual(d.argument.keys[0].name, 'testname')
})

test('`params` should have keys of the argument when they are omitted', t => {
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
  dispatcher.extractArgument(context)

  const { dispatcher: d } = context.state
  const { params } = context

  t.deepEqual(params, { testname: undefined })
  t.deepEqual(d.argument.keys[0].name, 'testname')
})

test('set custom extract argument function', t => {
  const dispatcher = new Dispatcher()

  const noop = () => {}
  dispatcher.setCustomExtractArgument(noop)

  t.is(dispatcher.extractArgument, noop)
})
