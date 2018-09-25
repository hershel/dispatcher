import * as pathToRegexp from 'path-to-regexp'
import { Application as App } from 'hershel'
import * as compose from 'koa-compose'

import { argument } from '../Dispatcher'
import { Command } from './Command'

export namespace Dispatch {
  export type middleware<C extends Command> = compose.Middleware<Context<C>>
  export type params = Record<string, string>
  export type PathToRegexpOptions = pathToRegexp.RegExpOptions &
    pathToRegexp.ParseOptions

  export interface Options {
    prefix: Iterable<string>
    pathToRegexp?: PathToRegexpOptions
  }

  export interface Context<C extends Command = Command> extends App.Context {
    state: { dispatcher: State<C> }
    params: params
  }

  export interface State<C extends Command = Command> {
    [argument]: ArgumentState
    command: CommandState<C>
    prefix: PrefixState
  }

  export interface CommandState<C extends Command = Command> {
    alias: string
    resolved: C
  }

  export interface PrefixState {
    detected: boolean
    content: string
    length: number
  }

  export interface ArgumentState {
    keys: pathToRegexp.Key[]
  }
}
