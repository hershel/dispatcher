import test from 'ava'

import { createTestContext } from '../dispatcher.helper'
import * as commands from '../command.helper'
import { Dispatcher } from '../../src'

test('should extract command correctly', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const context = createTestContext({
    message: { content: `!${test.name}` }
  })

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  const { command } = context.state.dispatcher

  t.is(command.alias, test.name)
  t.is(command.resolved, test)
})

test('should extract command from command aliases', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const context = createTestContext({
    message: { content: `!${test.aliases[0]}` }
  })

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  const { command } = context.state.dispatcher

  t.is(command.alias, test.aliases[0])
  t.is(command.resolved, test)
})

test('should normalize command input', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const context = createTestContext({
    message: { content: '!tEsT' }
  })

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)

  const { command } = context.state.dispatcher

  t.is(command.resolved, test)
  t.is(command.alias, 'test')
})
