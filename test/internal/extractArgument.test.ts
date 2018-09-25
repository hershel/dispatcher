import test from 'ava'

import { createTestContext } from '../dispatcher.helper'
import { Dispatcher, argument } from '../../src'
import * as commands from '../command.helper'

test('should extract arguments correctly', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const context = createTestContext({
    message: { content: `!${test.name} extractArgument 2` }
  })

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)
  dispatcher.extractArgument(context)

  const arg = context.state.dispatcher[argument]
  const { params } = context

  t.deepEqual(params, { name: 'extractArgument', id: '2' })

  t.is(arg.keys[0].name, 'name')
  t.false(arg.keys[0].optional)

  t.is(arg.keys[1].name, 'id')
  t.true(arg.keys[1].optional)
})

test(`should work with command wich doesn't have argument`, t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.NoArgument()
  dispatcher.register(test)

  const context = createTestContext({
    message: { content: `!${test.name}` }
  })

  dispatcher.extractPrefix(context)
  dispatcher.extractCommand(context)
  dispatcher.extractArgument(context)

  const arg = context.state.dispatcher[argument]
  const { params } = context

  t.deepEqual(arg.keys, [])
  t.deepEqual(params, {})
})

test('`params` should have all argument keys even when they are omitted', t => {
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
  dispatcher.extractArgument(context)

  const { params } = context

  t.deepEqual(params, { name: undefined, id: undefined })
})
