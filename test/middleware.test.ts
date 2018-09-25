import { stub, spy } from 'sinon'
import test from 'ava'

import { createTestContext, createHershelContext } from './dispatcher.helper'
import * as commands from './command.helper'
import { Dispatcher } from '../src'

const noop = async () => {}

test('`.commands` should add `executeCommand` only once', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  // @ts-ignore
  t.is(dispatcher.middleware.length, 0)

  dispatcher.commands()

  // @ts-ignore
  t.is(dispatcher.middleware.length, 1)
  t.true(dispatcher.started)

  dispatcher.commands()

  // @ts-ignore
  t.is(dispatcher.middleware.length, 1)
})

test('`.commands` middleware should mutate context', async t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const callback = spy()
  const context = createHershelContext({
    message: { content: '!test commands' }
  })

  t.is(typeof context.state.dispatcher, 'undefined')

  await dispatcher.commands()(context, callback)

  t.true(callback.calledOnce)
  t.is(typeof context.state.dispatcher, 'object')

  t.is(context.state.dispatcher.command.resolved, test)
  t.is(context.state.dispatcher.prefix.content, '!')
  t.deepEqual(context.params, { id: undefined, name: 'commands' })
})

test('`.commands` middleware should not handle message from bot', async t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  const action = stub(test, 'action')
  dispatcher.register(test)

  const callback = spy()

  {
    const context = createTestContext({
      message: { content: '!test', author: { bot: true } }
    })

    await dispatcher.commands()(context, callback)
    t.true(callback.calledOnce)
    t.true(action.notCalled)
  }

  callback.resetHistory()
  action.resetHistory()

  {
    const context = createTestContext({
      message: { content: '!test', author: { id: '1' } },
      app: { id: '1' }
    })

    await dispatcher.commands()(context, callback)

    t.true(callback.calledOnce)
    t.true(action.notCalled)
  }
})

test('`.commands` middleware should throw on error', async t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const context = createTestContext({
    message: { content: '!test throw' }
  })

  const test = new commands.Test()
  test.action = async () => {
    throw new Error('Throw on action')
  }
  dispatcher.register(test)

  await t.throwsAsync(dispatcher.commands()(context, noop), {
    message: 'Throw on action'
  })
})

test('`.commands` middleware should execute command', async t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const context = createTestContext({
    message: { content: '!test execute' }
  })

  const test = new commands.Test()
  const action = stub(test, 'action')
  dispatcher.register(test)

  const callback = spy()

  await dispatcher.commands()(context, callback)

  t.true(action.calledOnceWithExactly(context))
  t.true(callback.calledAfter(action))
  t.true(callback.calledOnce)
})

test('`.commands` middleware should return next() ASAP', async t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  const action = stub(test, 'action')
  dispatcher.register(test)

  const callback = spy()

  // should return next when prefix is not detected
  {
    const context = createTestContext({
      message: { content: 'hello u' }
    })

    await dispatcher.commands()(context, callback)

    const { prefix, command } = context.state.dispatcher
    t.is(command.resolved, null)
    t.false(prefix.detected)

    t.true(callback.calledOnce)
    t.true(action.notCalled)
  }

  callback.resetHistory()
  action.resetHistory()

  // should return next when no valid command detected
  {
    const context = createTestContext({
      message: { content: '!hi' }
    })

    await dispatcher.commands()(context, callback)

    const { prefix, command } = context.state.dispatcher
    t.is(command.alias, 'hi')
    t.true(prefix.detected)

    t.true(callback.calledOnce)
    t.true(action.notCalled)
  }
})
