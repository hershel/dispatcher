import * as d from 'discord.js'
import * as h from 'hershel'

import { Dispatch, createDispatcherContext } from '../src'

type UserOptions = Partial<Pick<d.User, 'tag' | 'bot' | 'id'>>

/**
 * Create test Hershel app
 */
const createApp = (options: UserOptions = {}): h.Client => ({
  // @ts-ignore
  user: {
    tag: options.tag || 'bot#0001',
    bot: options.bot || true,
    id: options.id || '0'
  }
})

type ContextOptions = {
  message?: Partial<Pick<d.Message, 'content' | 'id'>> & {
    author?: Partial<Pick<d.User, 'tag' | 'bot' | 'id'>>
  }
  app?: UserOptions
}

/**
 * Create test Hershel context
 * @param message message options
 */
export const createHershelContext = (
  options?: ContextOptions
): Dispatch.Context => ({
  id: null,
  // @ts-ignore
  message: { ...{ author: { bot: false, id: '1' } }, ...options.message },
  app: createApp(options.app),
  logger: Object.create(require('abstract-logging')),
  // @ts-ignore
  state: {},
  // @ts-ignore
  createReply: () => {}
})

/**
 * Create Disaptcher context for test
 * @param options context options
 */
export const createTestContext = (options?: ContextOptions) => {
  const context = createHershelContext(options)
  createDispatcherContext(context)

  return context
}
