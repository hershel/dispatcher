import test from 'ava'

import { Dispatcher } from '../src'
import * as commands from './command.helper'

test('register command in dispatcher', t => {
  const dispatcher = new Dispatcher()

  t.notThrows(() => dispatcher.add(new commands.TestCommand()))
})

test('command should be added to registry', t => {
  const dispatcher = new Dispatcher()

  const command = new commands.TestCommand()
  dispatcher.add(command)

  const { registry } = dispatcher

  const getCommand = registry.resolve('test')

  t.is(command, getCommand, 'should be the same object')
})

test('should add all aliases in registry', t => {
  const dispatcher = new Dispatcher()

  const command = new commands.TestCommand()

  dispatcher.add(command)

  const { registry } = dispatcher

  t.is(registry.commands.size, 2)

  for (let alias in command.values()) {
    t.is(registry.resolve(alias), command)
  }
})

test('`.delete` should delete the alias specified with string', t => {
  const dispatcher = new Dispatcher()

  dispatcher.add(new commands.TestCommand())

  const { registry } = dispatcher

  registry.delete('test')

  t.is(registry.commands.size, 1)
  t.deepEqual([...registry.commands.keys()], ['t'])
})

test('`.delete` should delete all aliases with command object', t => {
  const dispatcher = new Dispatcher()

  const command = new commands.TestCommand()

  dispatcher.add(command)

  const { registry } = dispatcher

  registry.delete(command)

  t.is(registry.commands.size, 0)
})

test('should throws on conflict', t => {
  const dispatcher = new Dispatcher()

  dispatcher.add(new commands.TestCommand())

  t.throws(() => dispatcher.add(new commands.ConflictNameWithTestCommand()), {
    message: '`test` alias is already registered by a command'
  })

  t.throws(() => dispatcher.add(new commands.ConflictAliasWithTestCommand()), {
    message: '`t` alias is already registered by a command'
  })
})

test('should resolve command with command name', t => {
  const dispatcher = new Dispatcher()

  const command = new commands.TestCommand()

  dispatcher.add(command)

  const { registry } = dispatcher

  t.is(registry.resolve('test'), command)
})

test('should resolve command with a command alias', t => {
  const dispatcher = new Dispatcher()

  const command = new commands.TestCommand()

  dispatcher.add(command)

  const { registry } = dispatcher

  t.is(registry.resolve('t'), command)
})

test('`resolve` should return null on unknow command', t => {
  const dispatcher = new Dispatcher()

  const { registry } = dispatcher

  t.is(registry.resolve('test'), null)
})

test('`clear` should clear registry', t => {
  const dispatcher = new Dispatcher()

  dispatcher.add(new commands.TestCommand())

  const { registry } = dispatcher

  t.is(registry.commands.size, 2)

  registry.clear()

  t.is(registry.commands.size, 0)
})

test('should add a command without aliases', t => {
  const dispatcher = new Dispatcher()

  t.notThrows(() => dispatcher.add(new commands.NoAliases()))
})

test('should throws when trying to register invalid command', t => {
  const dispatcher = new Dispatcher()

  t.throws(() => dispatcher.add(new commands.invalid.NoName()))
  // @ts-ignore
  t.throws(() => dispatcher.add(new commands.invalid.NoInstanceOfCommand()))
})
