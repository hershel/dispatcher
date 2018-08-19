import { Command } from '../src'

export class TestCommand extends Command {
  constructor() {
    super({
      name: 'test',
      aliases: ['t'],
      argument: ':testname'
    })
  }

  public async action() {}
}

export class NoArgument extends Command {
  constructor() {
    super({
      name: 'test',
      aliases: ['t']
    })
  }

  public async action() {}
}

export class ConflictNameWithTestCommand extends Command {
  constructor() {
    super({
      name: 'test',
      aliases: ['conflict']
    })
  }

  public async action() {}
}

export class ConflictAliasWithTestCommand extends Command {
  constructor() {
    super({
      name: 'conflict',
      aliases: ['t']
    })
  }

  public async action() {}
}

export class NoAliases extends Command {
  constructor() {
    super({
      name: 'hello'
    })
  }

  public action() {}
}

class NoName extends Command {
  constructor() {
    super()
  }

  public async action() {}
}

// @ts-ignore
class NoAction extends Command {
  constructor() {
    super({
      name: 'test'
    })
  }
}

class NoInstanceOfCommand {}

export const invalid = {
  NoName,
  NoAction,
  NoInstanceOfCommand
}
