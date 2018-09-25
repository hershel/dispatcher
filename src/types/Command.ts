import { Dispatch } from './Dispatch'

export namespace Command {
  export interface Options {
    options?: Dispatch.PathToRegexpOptions
    argument?: string
    aliases?: string[]
    name: string
  }
}

export abstract class Command {
  public readonly options?: Dispatch.PathToRegexpOptions
  public readonly aliases?: string[] = []
  public readonly argument?: string
  public readonly name: string

  constructor(options: Command.Options) {
    if (options.aliases) this.aliases = options.aliases
    this.argument = options.argument
    this.options = options.options
    this.name = options.name
  }

  /**
   * Action of the command
   * @param context Dispatcher context
   */
  public abstract action(context: Dispatch.Context): Promise<any> | any

  /**
   * Iterator object that contains the values for each alias
   */
  public values() {
    const aliases = [this.name]
      .concat(this.aliases)
      .filter(Boolean)
      .map(a => a.toLowerCase().trim())

    return new Set(aliases)[Symbol.iterator]()
  }
}
