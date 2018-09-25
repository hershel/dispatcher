import test from 'ava'

import * as commands from './command.helper'
import { Command } from '../src'

test('`.values` must have all possible aliases', t => {
  const command = new commands.Test()

  t.deepEqual([...command.values()], ['test', 't'])
})
