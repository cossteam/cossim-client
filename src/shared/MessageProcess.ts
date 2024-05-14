import cacheStore from '@/utils/cache'

class MessageProcess {
	public dialogId: number = 0
	public messages: Message[] = []

	constructor() {}

	async setDialogMessages(dialogId: number, messages: Message[]): Promise<Message[]> {
		await cacheStore.set(`${dialogId}`, messages)
		return messages
	}

	async getDialogMessages(dialogId: number): Promise<Message[]> {
		const channel = await cacheStore.get(`${dialogId}`)
		return channel
	}

	async deleteDialogMessages(dialogId: number): Promise<void> {
		await cacheStore.remove(`${dialogId}`)
	}

	async updateDialogMessage(dialogId: number, message: Message): Promise<void> {
		const messages = await this.getDialogMessages(dialogId)
		const index = messages.findIndex((m) => m.id === message.id)
		if (index !== -1) {
			messages[index] = { ...messages[index], ...message }
			await this.setDialogMessages(dialogId, messages)
		}
	}

	async sendDialogMessage(dialogId: number, message: Message): Promise<void> {
		const messages = await this.getDialogMessages(dialogId)
		messages.push(message)
		await this.setDialogMessages(dialogId, messages)
	}

	async deleteDialogMessage(dialogId: number, messageId: number): Promise<void> {
		const messages = await this.getDialogMessages(dialogId)
		const index = messages.findIndex((m) => m.id === messageId)
		if (index !== -1) {
			messages.splice(index, 1)
			await this.setDialogMessages(dialogId, messages)
		}
	}
}

export default MessageProcess
