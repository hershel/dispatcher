import { Message } from 'discord.js'

interface CreateMessage extends Pick<Message, 'content' | 'id' | 'author'> {
  [key: string]: any
}

export type msg = Partial<CreateMessage>

// @ts-ignore
const defaultMessage: CreateMessageTypes = {
  id: Date.now().toString(),
  content: 'hello world',
  author: {
    tag: 'HelloWorld#0001',
    bot: false,
    id: '1'
  },
  channel: { send: () => {}, type: 'text' },
  edit: () => {}
}

export const createMessage = (items?: Partial<CreateMessage>) => ({
  ...defaultMessage,
  ...items
})
