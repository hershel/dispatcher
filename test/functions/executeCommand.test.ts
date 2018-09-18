import { stub } from 'sinon'
import test from 'ava'

import { Dispatcher, IDispatcher, createDispatcherContext } from '../../src'
import * as commands from '../command.helper'
import { createContext } from '../helper'

test.serial('should execute command', async t => {
  t.plan(4)

  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.TestCommand()

  const commandStub = stub(command, 'action')

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  t.truthy(context.state.dispatcher.command.command)

  // @ts-ignore
  await dispatcher.executeCommand(context, async () => {
    t.pass()
  })

  t.true(commandStub.calledOnce)
  t.true(commandStub.calledWith(context))
})

test.serial('should verify if command exist in state', async t => {
  t.plan(2)

  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.TestCommand()

  const commandStub = stub(command, 'action')

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  context.state.dispatcher.command.command = null

  await t.notThrowsAsync(
    // @ts-ignore
    dispatcher.executeCommand(context, async () => {
      t.pass()
    })
  )

  t.false(commandStub.called)
})

test('should verify if `.action` exist on command object', async t => {
  t.plan(3)

  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new commands.invalid.NoAction()

  dispatcher.add(command)

  // @ts-ignore
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  t.truthy(context.state.dispatcher.command.command)

  await t.notThrowsAsync(
    // @ts-ignore
    dispatcher.executeCommand(context, async () => {
      t.pass()
    })
  )
})

test('set custom execute command function', t => {
  const dispatcher = new Dispatcher()

  const noop = () => {}
  dispatcher.setCustomExecuteCommand(noop)

  // @ts-ignore
  t.is(dispatcher.executeCommand, noop)
})
