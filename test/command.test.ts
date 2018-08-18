import test from 'ava'

import * as commands from './command.helper'

test('`.values` should be an iterable', t => {
  const command = new commands.TestCommand()

  t.is(typeof command.values()[Symbol.iterator], 'function')
})

test('`.values` must have all aliases', t => {
  const command = new commands.TestCommand()

  t.deepEqual([...command.values()], ['test', 't'])
})
