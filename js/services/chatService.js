export default class ChatService {
  constructor() {
    this.server = new SillyClient()
    this.userID = null
    this.userNames = {}
    this.onRoomInfoReceived = null
    this.server.on_connect = () => this.onConnect()
    this.server.on_ready = (id) => this.onReady(id)
    this.server.on_message = (author_id, msg) => this.onMessage(author_id, msg)
    this.server.on_user_connected = (user_id) => this.onUserConnected(user_id)
    this.server.on_user_disconnected = (user_id) =>
      this.onUserDisconnected(user_id)
    this.server.on_room_info = (info) => this.onRoomInfo(info)
    this.server.on_close = () => this.onClose()
    this.server.on_error = (err) => this.onError(err)

    this.onMessageReceived = null
    this.onUsersUpdated = null
  }

  connect(serverUrl, roomName) {
    this.server.connect(serverUrl, roomName)
  }

  sendMessage(msg, recipients = null) {
    if (recipients) {
      this.server.sendMessage(msg, recipients)
    } else {
      this.server.sendMessage(msg)
    }
  }

  onConnect() {
    console.log('Connected to the server.')
  }

  onReady(id) {
    this.userID = id
    console.log('Connected with ID:', id)
  }

  onMessage(author_id, msg) {
    try {
      const messageData = JSON.parse(msg)
      this.userNames[author_id] = messageData.username

      if (this.onMessageReceived) {
        this.onMessageReceived(messageData, author_id)
      }
    } catch (e) {
      console.error('error:', e)
    }
  }

  onUserConnected(user_id) {
    this.onUserConnected(user_id)
  }

  onUserDisconnected(user_id) {
    this.onUserConnected(user_id)
  }

  updateUsersCount() {
    if (this.onUsersUpdated) {
      this.onUsersUpdated(Object.keys(this.connectedUsers).length)
    }
  }

  onClose() {
    console.log('Connection closed.')
  }

  onError(err) {
    console.error('Connection error:', err)
  }

  onRoomInfo(info) {
    console.log('Room info:', info)
    if (this.onRoomInfoReceived) {
      this.onRoomInfoReceived(info)
    }
  }
}
