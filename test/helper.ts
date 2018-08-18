import { createMessage, msg } from './discord.helper'
import { Message } from 'discord.js'

export const createContext = (msg: msg) => {
  const message = createMessage(msg) as Message

  return {
    id: message.id,
    message: message,
    app: createApp(),
    logger: null,
    state: {},
    createReply: () => {}
  }
}

const createApp = () => ({
  user: {
    tag: 'bot#0001',
    bot: true,
    id: '42'
  }
})
