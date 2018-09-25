import * as pathToRegexp from 'path-to-regexp'
import * as compose from 'koa-compose'

import { Dispatch, Command } from './types'
import { Registry } from './Registry'
import { assert } from './util'

type ContextFunction<R = void> = (ctx: Dispatch.Context) => R

export const argument = Symbol.for('@hershel/dispatcher.argument')

export class Dispatcher<C extends Command = Command> {
  private middleware: Dispatch.middleware<C>[] = []
  private _registry = new Registry<C>()
  private options: Dispatch.Options
  private _prefixes: Set<string>
  private _started: boolean

  constructor(options: Dispatch.Options) {
    assert(typeof options === 'object', 'options should be an object')

    this._prefixes = new Set(options.prefix)

    options.pathToRegexp = {
      ...Dispatcher.PATHTOREGEXP_DEFAULT,
      ...options.pathToRegexp
    }

    this.options = options
  }

  /**
   * Dispatcher middleware
   */
  public commands() {
    if (!this.started) {
      this.use(this.executeCommand)
      this._started = true
    }

    const composed = compose(this.middleware)

    const dispatch: Dispatch.middleware<C> = async (ctx, next) => {
      if (!this.shouldHandle(ctx)) return next()

      createDispatcherContext(ctx)
      const { dispatcher } = ctx.state

      this.extractPrefix(ctx)
      if (!dispatcher.prefix.detected) return next()

      this.extractCommand(ctx)
      if (!dispatcher.command.resolved) return next()

      this.extractArgument(ctx)

      await composed(ctx)

      next()
    }

    return dispatch
  }

  /**
   * Add new middleware inside Dispatcher
   * @param fn middleware function
   */
  public use(fn: Dispatch.middleware<C>) {
    this.throwIfAlreadyStarted('cannot add middleware')
    assert(typeof fn === 'function', 'provided middleware is not a function')

    this.middleware.push(fn)
    return this
  }

  /**
   * Add new command in Dispatcher
   * @param command command
   */
  public register(command: C) {
    this._registry.register(command)
    return this
  }

  /**
   * Check if dispatcher should handle the message
   * @param message discord message
   */
  public shouldHandle({ message, app }: Dispatch.Context) {
    if (message.author.id === app.user.id) return false
    if (message.author.bot) return false

    return true
  }

  /**
   * Set custom shouldHandle function
   * @param fn custom shouldHandle function
   */
  public setCustomShouldHandle(fn: ContextFunction<boolean>) {
    this.throwIfAlreadyStarted('cannot set custom function')
    assert(typeof fn === 'function', 'ShouldHandle should be a function')

    this.shouldHandle = fn

    return this
  }

  /**
   * Extract prefix from message content
   * @param context Dispatcher context
   */
  public extractPrefix({ message, state }: Dispatch.Context) {
    const { prefix } = state.dispatcher
    const content = message.content.trim()

    for (let p of this._prefixes) {
      if (content.startsWith(p)) {
        Object.assign<any, Dispatch.PrefixState>(prefix, {
          content: p,
          detected: true,
          length: p.length
        })
        break
      }
    }
  }

  /**
   * Set custom extractPrefix function
   * @param fn custom extractPrefix function
   */
  public setCustomExtractPrefix(fn: ContextFunction) {
    this.throwIfAlreadyStarted('cannot set custom function')
    assert(typeof fn === 'function', 'ExtractPrefix should be a function')

    this.extractPrefix = fn

    return this
  }

  /**
   * Extract command from message content
   * @param context Dispatcher context
   */
  public extractCommand({ message, state }: Dispatch.Context) {
    const { prefix, command } = state.dispatcher

    const name = message.content
      .slice(prefix.length)
      .split(' ')[0]
      .trim()
      .toLowerCase()

    command.alias = name
    command.resolved = this._registry.resolve(name)
  }

  /**
   * Set custom extractCommand function
   * @param fn custom extractCommand function
   */
  public setCustomExtractCommand(fn: ContextFunction) {
    this.throwIfAlreadyStarted('cannot set custom function')
    assert(typeof fn === 'function', 'ExtractCommand should be a function')

    this.extractCommand = fn

    return this
  }

  /**
   * Extract arguments from message content
   * @param context Dispatcher context
   */
  public extractArgument({ message, state, params }: Dispatch.Context) {
    let { prefix } = state.dispatcher
    let arg = state.dispatcher[argument]

    const command = state.dispatcher.command

    const path = command.resolved.argument
    if (!path) return

    const content = message.content
      .replace(prefix.content, '')
      .replace(command.alias, '')
      .replace(/\s+/g, ' ')
      .trim()

    const p =
      pathToRegexp(path, arg.keys, {
        ...this.options.pathToRegexp,
        ...command.resolved.options
      }).exec(content) || ([] as RegExpExecArray)

    Object.assign(
      params,
      arg.keys.reduce((a, k, i) => ({ [k.name]: p[i + 1], ...a }), {})
    )
  }

  /**
   * Set custom extractArgument function
   * @param fn custom extractArgument function
   */
  public setCustomExtractArgument(fn: ContextFunction) {
    this.throwIfAlreadyStarted('cannot set custom function')
    assert(typeof fn === 'function', 'ExtractArgument should be a function')

    this.extractArgument = fn

    return this
  }

  /**
   * ExecuteCommand middleware for Dispatcher
   */
  public executeCommand: Dispatch.middleware<C> = async (ctx, next) => {
    const { resolved } = ctx.state.dispatcher.command

    await resolved.action(ctx)

    next()
  }

  /**
   * Throw if Dispatcher is already started
   * @param message message to throw
   */
  private throwIfAlreadyStarted(message: string) {
    if (this._started) {
      throw new Error(`${message} while dispatcher is already started`)
    }
  }

  /**
   * If the Dispatcher is already started
   */
  get started() {
    return this._started
  }

  /**
   * Get Commands registry
   */
  get registry() {
    return this._registry
  }

  /**
   * Get all possible prefixes
   */
  get prefixes() {
    return [...this._prefixes]
  }

  /**
   * Default options for pathToRegexp
   */
  static PATHTOREGEXP_DEFAULT: Dispatch.PathToRegexpOptions = {
    delimiters: [' '],
    delimiter: ' ',
    end: false
  }
}

/**
 * Create Dispatcher context
 * @param ctx dispatcher context
 */
export function createDispatcherContext(ctx: Dispatch.Context) {
  ctx.params = {}
  ctx.state.dispatcher = {
    prefix: { content: null, detected: false, length: NaN },
    command: { alias: null, resolved: null },
    [argument]: { keys: [] }
  }
}
