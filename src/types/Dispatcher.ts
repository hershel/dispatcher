import * as pathToRegexp from 'path-to-regexp'
import { Application as App } from 'hershel'
import * as compose from 'koa-compose'

import { Dispatcher } from '../Dispatcher'
import { Command } from '../Command'

export namespace IDispatcher {
  export type middleware = compose.Middleware<Context>

  export interface PrefixData {
    detected: boolean
    length: number
    name: string
  }

  export interface CommandData<C extends Command> {
    command: C
    name: string
  }

  export interface ArgumentData {
    keys: pathToRegexp.Key[]
  }

  export interface State<C extends Command> {
    argument: ArgumentData
    dispatcher: Dispatcher
    command: CommandData<C>
    prefix: PrefixData
  }

  export interface Context<C extends Command = Command> extends App.Context {
    params: Record<string, string | any>
    state: {
      dispatcher: State<C>
    }
  }

  export interface Options {
    /** command prefix */
    prefix?: Iterable<string>
    /** path-to-regexp options */
    pathToRegexp?: pathToRegexp.RegExpOptions & pathToRegexp.ParseOptions
  }
}
