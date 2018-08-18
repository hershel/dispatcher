import { Command } from './Command'
import ow from 'ow'

export class Registry {
  public commands = new Map<string, Command>()

  /**
   * resolve command name to command
   * @param name command name
   */
  public resolve(name: string) {
    return this.commands.get(name) || null
  }

  /**
   * Check aliases conflicts
   * @param aliases command alises
   */
  private conflict(alias: string) {
    if (this.commands.has(alias)) {
      throw new Error(`\`${alias}\` alias is already registered by a command`)
    }
  }

  /**
   * Register new command
   * @param command command object
   */
  public register(command: Command) {
    this.checkCommand(command)

    const aliases = [...command.values()]

    ow(aliases, ow.array.minLength(1).label('total aliases'))

    for (let alias of aliases) {
      alias = alias.toLowerCase()
      this.conflict(alias)
      this.commands.set(alias, command)
    }

    return this
  }

  /**
   * Check command
   * @param command command
   */
  private checkCommand(command: Command) {
    const { aliases, name, argument } = command

    ow(command, ow.object.instanceOf(Command).label('command'))
    ow(name, ow.string.minLength(3).label('command name'))

    if (argument) ow(argument, ow.string.label('command argument'))
    if (aliases) ow(aliases, ow.array.ofType(ow.string).label('aliases'))
  }

  /**
   * Clear registry
   */
  public clear() {
    this.commands.clear()

    return this
  }

  /**
   * Delte command from registry
   * @param command command objet or name
   */
  public delete(command: string | Command) {
    if (command instanceof Command) {
      for (let alias of command.values()) this.commands.delete(alias)
    }

    if (typeof command === 'string') {
      this.commands.delete(command)
    }

    return this
  }
}
