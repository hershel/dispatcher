import { stub } from 'sinon'
import test from 'ava'

import { createTestContext } from '../dispatcher.helper'
import * as commands from '../command.helper'
import { Dispatcher } from '../../src'

test.serial('should execute command', async t => {
  t.plan(3)

  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  const commandStub = stub(test, 'action')

  dispatcher.register(test)

  const context = createTestContext({
    message: { content: `!${test.name} executeCommand` }
  })

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  const { command } = context.state.dispatcher
  t.truthy(command.resolved)

  await dispatcher.executeCommand(context, async () => {
    t.pass()
  })

  t.true(commandStub.calledOnceWithExactly(context))
})

test('should throw if `.action` throw', async t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  test.action = async () => {
    throw new Error('Throw on action')
  }

  dispatcher.register(test)

  const context = createTestContext({
    message: { content: `!${test.name} executeCommand` }
  })

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  await t.throwsAsync(dispatcher.executeCommand(context, async () => {}), {
    message: 'Throw on action'
  })
})
