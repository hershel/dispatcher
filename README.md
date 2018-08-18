<h2 align="center">@hershel/dispatcher</h2>

<p align="center">
  <em>Command dispatcher for <a href="https://github.com/hershel/hershel">Hershel</a></em>
</p>

`@hershel/dispatcher` adds to your bot the ability to respond to specific commands.

This package has been created in a minimalist, refined and modular spirit. Some functions you may want to have (like role checking to use commands etc...) can be very easily implemented thanks to the internal middlewares of the dispatcher. Let's keep things simple.

## Install

```
npm i @hershel/dispatcher
```

## Features

- **Modular:** We wanted to provide a powerful package while remaining refined. You can add features directly from the dispatcher using middlewares (see lifecycle).

- **Customizable:** this module contains default behaviors (for example, not taking into account messages from other bot). All of these behaviours can be overridden by your own verification systems.

- **Simple:** Integrates perfectly into Hershel in one line of code. You can also reuse this middleware for other project.

## Example

Basic usage

```js
import * as hershel from 'hershel'
import { Dispatcher } from '@hershel/dispatcher'

const bot = new hershel.Client()
const dispatcher = new Dispatcher({
  prefixes: ['!', '?!?']
})

bot.use(dispatcher.commands())

bot.login(process.env.TOKEN)
```

> It's important to know that `@hershel/dispatcher` **does not** implement any commands natively.

### Lifecycle

```
-> [...]
-> Dispatcher middleware with .commands()
  |-> check if the dispatcher should handle the message (shouldHandle)
  |-> check & extract prefix from the message
  |-> extract command name and resolve it
  |-> parse arguments for the command
  |-> execute custom middlewares (e.g. authorization...)
  |-> execute the command
-> Others Hershel middlewares
```

#### shouldHandle -> boolean

Check if the message should be handled by the dispatcher

#### extractPrefix -> void

Injects in context state `prefix` key with the name of the prefix, its length and if a prefix has been detected.

#### extractCommand -> void

Injects in context state `command` key with the name of the command, and the command object resolved.

#### extractArgument -> void

Injects in context state `argument` key with the name of the arguments.

## Related

- [hershel](https://github.com/hershel/hershel) - A framework for modular and blazing fast Discord bots
- [hershel/plugin](https://github.com/hershel/plugin) - Plugin helper for Hershel
- [hershel/examples](https://github.com/hershel/examples) - Example of integration with Hershel

## Thanks

Hershel uses part of [Fastify](https://github.com/fastify/fastify)'s theoretical logic, a fast and low overhead web framework for Node.js.

## License

MIT
