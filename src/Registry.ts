import { Command } from './types/Command'
import { assert } from './util'

type Deletable<C extends Command> = string | C
export class Registry<C extends Command> {
  private _commands = new Map<string, C>()

  /**
   * Resolve command name to command
   * @param name
   */
  public resolve(name: string) {
    return this._commands.get(name) || null
  }

  /**
   * Register new command in Registry
   * @param command command object
   */
  public register(command: C) {
    const aliases = [...command.values()]
    assert(aliases.length > 0, `${command.constructor.name} has no alias`)

    this.checkCommand(command)

    for (let alias of aliases) {
      this.conflict(alias)
      this._commands.set(alias, command)
    }

    return this
  }

  /**
   * Delte command from the Registry
   * @param target command object or name to delete
   */
  public delete(target: Deletable<C> | (Deletable<C>)[]) {
    if (Array.isArray(target)) {
      target.forEach(t => this.delete.apply(this, [t]))

      return this
    }

    if (target instanceof Command) {
      const deletable = [...this.commands.entries()]
        .filter(e => e[1] === target)
        .map(e => e[0])

      deletable.forEach(t => this.delete.apply(this, [t]))
    }

    if (typeof target === 'string') {
      this.commands.delete(target)
    }

    return this
  }

  /**
   * Check aliases conflicts
   * @param alias alias to check
   */
  private conflict(alias: string) {
    if (this._commands.has(alias)) {
      throw new Error(`\`${alias}\` is already registered by a command`)
    }
  }

  /**
   * Check if command is valid
   * @param command command
   */
  private checkCommand(command: C) {
    const { aliases, name, action } = command

    assert(command instanceof Command, `${name} should be instance of Command`)
    assert(typeof action === 'function', '.action should be a function')
    assert(name.length >= 2, 'name length should be >= 2')

    if (aliases.length >= 1) {
      aliases.forEach(a =>
        assert(typeof a === 'string', 'all aliases must be a string')
      )
    }
  }

  /**
   * Commands map object (Registry)
   */
  get commands() {
    return this._commands
  }

  /**
   * Size of the commands map
   */
  get size() {
    return this._commands.size
  }
}
