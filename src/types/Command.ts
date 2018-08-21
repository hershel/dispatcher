import * as pathToRegexp from 'path-to-regexp'

export namespace ICommand {
  export interface Options {
    name: string
    aliases: string[]
    argument: string
    options: pathToRegexp.RegExpOptions
  }
}
