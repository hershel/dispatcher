import { Command } from '../src'

export class Test extends Command {
  constructor() {
    super({
      name: 'test',
      aliases: ['t'],
      argument: ':name :id?',
      options: {}
    })
  }

  public async action() {}
}

export class ConflictWithTest extends Command {
  constructor() {
    super({
      name: 'test'
    })
  }

  public async action() {}
}

export class NoArgument extends Command {
  constructor() {
    super({
      name: 'noargument',
      aliases: ['narg']
    })
  }

  public async action() {}
}
