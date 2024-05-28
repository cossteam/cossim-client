let socket = null

export function createSocket() {
	socket = io('', {
		query: {
			token: ''
		},
		transports: ['websocket']
		// path: path
	})

	// onReply(socket)
	return socket
}

export function closeSocket(Socket?: any) {
	if (Socket) Socket.close()
	// else socket.close()
}
