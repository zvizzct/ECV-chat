export default class ChatHistory {
  constructor() {
    this.rooms = {}
  }

  addMessage(roomName, message) {
    if (!this.rooms[roomName]) {
      this.rooms[roomName] = { history: [], users: [] }
    }
    this.rooms[roomName].history.push(message)
  }

  getHistory(roomName) {
    return this.rooms[roomName] ? this.rooms[roomName].history : []
  }

  addUserToRoom(roomName, userId) {
    if (!this.rooms[roomName]) {
      this.rooms[roomName] = { history: [], users: [] }
    }
    if (!this.rooms[roomName].users.includes(userId)) {
      this.rooms[roomName].users.push(userId)
    }
  }

  removeUserFromRoom(roomName, userId) {
    if (this.rooms[roomName]) {
      this.rooms[roomName].users = this.rooms[roomName].users.filter(
        (user) => user !== userId
      )
    }
  }
}
