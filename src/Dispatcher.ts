import * as pathToRegexp from 'path-to-regexp'
import { Application as App } from 'hershel'
import * as compose from 'koa-compose'
import ow from 'ow'

import { IDispatcher } from './types/Dispatcher'
import { Registry } from './Registry'
import { Command } from './Command'

export class Dispatcher {
  private middleware: IDispatcher.middleware[] = []
  private _started = false

  public options: IDispatcher.Options
  public registry = new Registry()
  public prefixes: Set<string>

  constructor(options: IDispatcher.Options = {}) {
    ow(options, ow.object.label('options'))

    options.pathToRegexp = {
      ...Dispatcher.DEFAULT_PATHTOREGEXP_OPTIONS,
      ...options.pathToRegexp
    }

    this.options = options
    this.prefixes = new Set(options.prefix)
  }

  /**
   * Static options for pathToRegexp
   */
  static DEFAULT_PATHTOREGEXP_OPTIONS: pathToRegexp.RegExpOptions &
    pathToRegexp.ParseOptions = {
    end: false,
    delimiter: ' ',
    delimiters: [' ']
  }

  /**
   * Dispatcher middleware
   */
  public commands() {
    this.middleware.push(this.executeCommand)
    const composed = compose(this.middleware)

    const dispatch: App.middleware = async (ctx: IDispatcher.Context, next) => {
      createDispatcherContext(ctx, this)

      if (!this.shouldHandle(ctx)) return next()

      this.extractPrefix(ctx)
      this.extractCommand(ctx)
      this.extractArgument(ctx)

      await composed(ctx)

      next()
    }

    return dispatch
  }

  /**
   * Add middleware
   * @param fn middleware function
   */
  public use(fn: IDispatcher.middleware) {
    this.throwIfAlreadyStarted('cannot add middleware')
    ow(fn, ow.function.label('middleware'))

    this.middleware.push(fn)

    return this
  }

  /**
   * Add command in dispatcher
   * @param command command
   */
  public add(command: Command) {
    this.registry.register(command)

    return this
  }

  /**
   * Check if dispatcher should handle the message
   * @param context dispatcher context
   */
  public shouldHandle({ message, app }: IDispatcher.Context) {
    if (message.author.id === app.user.id) return false
    if (message.author.bot) return false

    return true
  }

  /**
   * Set custom shouldHandle function
   * @param fn custom shouldHandle function
   */
  public setCustomShouldHandle(fn: (ctx: IDispatcher.Context) => boolean) {
    this.throwIfAlreadyStarted('cannot set custom function')
    ow(fn, ow.function.label('custom shouldHandle'))

    this.shouldHandle = fn

    return this
  }

  /**
   * Extract prefix from message content
   * @param context context
   */
  public extractPrefix({ message, state }: IDispatcher.Context) {
    const { prefix } = state.dispatcher
    const content = message.content.trim()

    // Prefix search
    for (let p of this.prefixes) {
      if (content.startsWith(p)) {
        Object.assign(prefix, { name: p, detected: true, length: p.length })
        break
      }
    }
  }

  /**
   * Set custom extractPrefix function
   * @param fn custom extractPrefix function
   */
  public setCustomExtractPrefix(fn: (ctx: IDispatcher.Context) => void) {
    this.throwIfAlreadyStarted('cannot set custom function')
    ow(fn, ow.function.label('custom extractPrefix'))

    this.extractPrefix = fn

    return this
  }

  /**
   * Extract command from message content
   * @param context context
   */
  public extractCommand({ message, state }: IDispatcher.Context) {
    const { prefix, command } = state.dispatcher

    if (!prefix.detected) return

    // extract command name
    const name = message.content
      .trim()
      .slice(prefix.length)
      .trim()
      .split(' ')[0]
      .toLowerCase()

    if (name.length === 0) return

    command.name = name
    command.command = this.registry.resolve(name)
  }

  /**
   * Set custom extractCommand function
   * @param fn custom extractCommand function
   */
  public setCustomExtractCommand(fn: (ctx: IDispatcher.Context) => void) {
    this.throwIfAlreadyStarted('cannot set custom function')
    ow(fn, ow.function.label('custom extractCommand'))

    this.extractCommand = fn

    return this
  }

  /**
   * Extract arguments from message content
   * @param context context
   */
  public extractArgument({ message, state, params }: IDispatcher.Context) {
    let { prefix, command, argument } = state.dispatcher
    const cmd = command.command

    if (!prefix.detected || !cmd) return

    const path = cmd.argument

    // allows commands without arguments
    if (!path) return

    const content = message.content
      .replace(/\s+/g, ' ')
      .replace(prefix.name, '')
      .replace(command.name, '')
      .trim()

    const r =
      pathToRegexp(path, argument.keys, {
        ...this.options.pathToRegexp,
        ...cmd.options
      }).exec(content) || ([] as RegExpExecArray)

    Object.assign(
      params,
      argument.keys.reduce(
        (acc, key, i) => ({ [key.name]: r[i + 1], ...acc }),
        {}
      )
    )
  }

  /**
   * Set custom extractArgument function
   * @param fn custom extractArgument function
   */
  public setCustomExtractArgument(fn: (ctx: IDispatcher.Context) => void) {
    this.throwIfAlreadyStarted('cannot set custom function')
    ow(fn, ow.function.label('custom extractArgument'))

    this.extractArgument = fn

    return this
  }

  /**
   * Execute command in the context
   * @param ctx context
   */
  private executeCommand: IDispatcher.middleware = async (ctx, next) => {
    const { command } = ctx.state.dispatcher.command

    if (!command) return
    if (typeof command.action !== 'function') return next()

    await command.action(ctx)

    next()
  }

  /**
   * Set custom executeCommand function
   * @param fn custom executeCommand function
   */
  public setCustomExecuteCommand(fn: IDispatcher.middleware) {
    this.throwIfAlreadyStarted('cannot set custom function')
    ow(fn, ow.function.label('custom executeCommand'))

    this.executeCommand = fn

    return this
  }

  /**
   * Throw if dispatcher is already started
   * @param msg message to throw
   */
  private throwIfAlreadyStarted(msg: string) {
    if (this._started) throw new Error(`${msg} when dispatcher already started`)
  }
}

/**
 * Create dispatcher context
 * @param context context
 */
export const createDispatcherContext = (
  ctx: IDispatcher.Context,
  dispatcher: Dispatcher
) => {
  ctx.state.dispatcher = {
    dispatcher: dispatcher,
    prefix: { name: null, length: NaN, detected: false },
    command: { name: null, command: null },
    argument: { keys: [] }
  }
  ctx.params = {}
}
