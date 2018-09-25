import test from 'ava'

import * as commands from './command.helper'
import { Dispatcher } from '../src'

test('register command in registry', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const { registry } = dispatcher
  const command = registry.resolve(test.name)

  t.is(command, test)
})

test('`resolve` should return null on unknown command', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const { registry } = dispatcher
  const command = registry.resolve('test')

  t.is(command, null)
})

test('should add all aliases in registry', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const { registry } = dispatcher

  t.is(registry.size, 2)

  t.deepEqual([...registry.commands.keys()], ['test', 't'])
})

test('delete command with string', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const { registry } = dispatcher

  t.is(registry.size, 2)

  registry.delete(test.name)

  t.is(registry.size, 1)
})

test('delete command with string array', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const { registry } = dispatcher

  t.is(registry.size, 2)

  registry.delete([test.name, test.aliases[0]])

  t.is(registry.size, 0)
})

test('delete command with command object', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  dispatcher.register(test)

  const { registry } = dispatcher

  t.is(registry.size, 2)

  registry.delete(test)

  t.is(registry.size, 0)
})

test('delete command with command object array', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  const test = new commands.Test()
  const noArg = new commands.NoArgument()
  dispatcher.register(test)
  dispatcher.register(noArg)

  const { registry } = dispatcher

  t.is(registry.size, 4)

  registry.delete([test, noArg])

  t.is(registry.size, 0)
})

test('throw on conflict', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  dispatcher.register(new commands.Test())

  t.throws(() => dispatcher.register(new commands.ConflictWithTest()), {
    message: '`test` is already registered by a command'
  })
})
