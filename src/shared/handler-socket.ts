/**
 * 处理私聊接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerUserMessageSocket = (data: any) => {
	try {
		console.log('处理私聊',data)
	} catch (error) {
		console.log('处理失败')
	}
}


/**
 * 处理群聊接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerGroupMessageSocket = (data: any) => {
	try {
		console.log('处理群聊',data)
	} catch (error) {
		console.log('处理失败')
	}
}

/**
 * 处理好友获取群聊请求接收的 socket 的消息
 * @param {*} data  socket 消息
 */
export const handlerRequestSocket = (data: any) => {
    try {
        console.log('处理好友请求',data)
    } catch (error) {
        console.log('处理失败')
    }
}