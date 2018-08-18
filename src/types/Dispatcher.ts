import * as pathToRegexp from 'path-to-regexp'
import { Application as App } from 'hershel'
import * as compose from 'koa-compose'

import { Dispatcher } from '../Dispatcher'
import { Command } from '../Command'

export declare namespace IDispatcher {
  type middleware = compose.Middleware<Context>

  interface PrefixData {
    detected: boolean
    length: number
    name: string
  }

  interface CommandData {
    command: Command
    name: string
  }

  interface ArgumentData {
    keys: pathToRegexp.Key[]
  }

  interface State {
    argument: ArgumentData
    dispatcher: Dispatcher
    command: CommandData
    prefix: PrefixData
  }

  export interface Context extends App.Context {
    params: Record<string, string>
    state: {
      dispatcher: State
    }
  }

  interface Options {
    /** command prefix */
    prefix?: Iterable<string>
    /** path-to-regexp options */
    pathToRegexp?: pathToRegexp.RegExpOptions & pathToRegexp.ParseOptions
  }
}
