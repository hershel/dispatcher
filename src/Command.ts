import * as pathToRegexp from 'path-to-regexp'

import { ICommand, IDispatcher } from './types/'

export abstract class Command {
  /** represents the ID of the command */
  public readonly name: string
  /** aliases for the command */
  public readonly aliases?: string[]
  /** command arguments */
  public readonly argument?: string
  /** options for path-to-regexp */
  public readonly options?: pathToRegexp.RegExpOptions

  constructor(options: Partial<ICommand.Options> = {}) {
    this.argument = options.argument
    this.aliases = options.aliases
    this.options = options.options
    this.name = options.name
  }

  /**
   * Command logic
   * @param context context
   */
  public abstract action(context: IDispatcher.Context): any | Promise<any>

  /**
   * Get all possible aliases for this command
   */
  public values() {
    const concat = [this.name].concat(this.aliases)
    return new Set(concat.filter(Boolean))[Symbol.iterator]()
  }
}
