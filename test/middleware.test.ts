import { stub, spy } from 'sinon'
import test from 'ava'

import { Dispatcher, IDispatcher, createDispatcherContext } from '../src'
import { TestCommand } from './command.helper'
import { createContext } from './helper'

test.serial.cb('`commands` middleware should execute command', t => {
  t.plan(2)

  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new TestCommand()

  const commandStub = stub(command, 'action')

  dispatcher.add(command)

  const commmands = dispatcher.commands()
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  // @ts-ignore
  commmands(context, () => {
    t.true(commandStub.called)
    t.true(commandStub.calledOnce)

    t.end()
  })
})

test.cb('`commands` middleware should not handle message', t => {
  t.plan(1)

  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new TestCommand()

  const commandStub = stub(command, 'action')

  dispatcher.add(command)

  const commmands = dispatcher.commands()
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  context.message.author.bot = true

  createDispatcherContext(context, dispatcher)

  // @ts-ignore
  commmands(context, () => {
    t.false(commandStub.called)

    t.end()
  })
})

test.serial.cb('execute dispatcher middleware following the lifecycle', t => {
  t.plan(4)

  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const command = new TestCommand()

  const commandStub = stub(command, 'action')
  const callback = spy()

  dispatcher.add(command)
  dispatcher.use((ctx, next) => {
    callback(ctx)
    next()
  })

  const commmands = dispatcher.commands()
  const context = createContext({
    content: '!test'
  }) as IDispatcher.Context

  createDispatcherContext(context, dispatcher)

  // @ts-ignore
  commmands(context, () => {
    t.true(commandStub.calledOnce)
    t.true(callback.calledOnce)
    t.true(callback.calledWith(context))
    t.true(callback.calledBefore(commandStub))

    t.end()
  })
})
