import test from 'ava'

import { Dispatcher } from '../src'

const noop: () => any = () => {}

test('create new dispatcher', t => {
  // @ts-ignore
  t.notThrows(() => new Dispatcher({}))
})

test('`new dispatcher` should throw when instanciated with wrong options', t => {
  // @ts-ignore
  t.throws(() => new Dispatcher('lol'), {
    message: 'options should be an object',
    instanceOf: TypeError
  })
})

test('should add middleware internally', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  // @ts-ignore
  t.is(dispatcher.middleware.length, 0)

  dispatcher.use(noop)

  // @ts-ignore
  t.is(dispatcher.middleware.length, 1)
  // @ts-ignore
  t.is(dispatcher.middleware[0], noop)
})

test('`.prefixes` should returns all prefixes', t => {
  const prefix = ['!', '.']
  const dispatcher = new Dispatcher({ prefix })

  t.deepEqual(dispatcher.prefixes, prefix)
})

test('cannot perfom changes on Dispatcher while dispatcher already started', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  // @ts-ignore
  dispatcher._started = true

  t.is(dispatcher.started, true)
  t.throws(() => dispatcher.use(() => {}), {
    message: 'cannot add middleware while dispatcher is already started'
  })

  const message =
    'cannot set custom function while dispatcher is already started'

  t.throws(() => dispatcher.setCustomExtractArgument(noop), { message })
  t.throws(() => dispatcher.setCustomExtractCommand(noop), { message })
  t.throws(() => dispatcher.setCustomExtractPrefix(noop), { message })
  t.throws(() => dispatcher.setCustomShouldHandle(noop), { message })
})

test('set custom functions', t => {
  const dispatcher = new Dispatcher({
    prefix: ['!']
  })

  dispatcher.setCustomExtractArgument(noop)
  dispatcher.setCustomExtractCommand(noop)
  dispatcher.setCustomExtractPrefix(noop)
  dispatcher.setCustomShouldHandle(noop)

  t.is(dispatcher.extractArgument, noop)
  t.is(dispatcher.extractCommand, noop)
  t.is(dispatcher.extractPrefix, noop)
  t.is(dispatcher.shouldHandle, noop)
})
