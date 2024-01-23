import ChatService from './services/chatService.js'
import UIHandler from './utils/uiHandler.js'
import { SERVER_URL, ROOM_NAME } from './config/serverConfig.js'
import ChatHistory from './utils/chatHistory.js'

class ChatApp {
  constructor() {
    this.uiHandler = new UIHandler()
    this.chatService = new ChatService()
    this.chatHistory = new ChatHistory()
    this.connectedUsers = {}
    this.currentRoom = ''
    this.currentUsername = ''
    this.hasReceivedHistory = false

    this.initializeEventListeners()
  }

  initializeEventListeners() {
    document.addEventListener(
      'DOMContentLoaded',
      this.initializeChatApp.bind(this)
    )
    this.uiHandler.setJoinRoomListener(this.joinRoomOnClick.bind(this))
    this.uiHandler.setSendMessageListener(this.sendMessageOnEnter.bind(this))
    this.uiHandler.setSendMessageButtonListener(
      this.handleSendMessage.bind(this)
    )
    this.uiHandler.setStatusClickListener(
      this.showAlertWithConnectedUsers.bind(this)
    )
    this.uiHandler.handleUserClick = this.handleUserClick.bind(this)
    this.uiHandler.setChatListClickCallback(this.changeRoom.bind(this))

    this.chatService.onUserConnected = this.handleUserConnected.bind(this)
    this.chatService.onUserDisconnected = this.handleUserDisconnected.bind(this)
    this.chatService.onRoomInfoReceived = this.handleRoomInfoReceived.bind(this)
    this.chatService.onMessageReceived = this.handleMessageReceived.bind(this)
  }

  initializeChatApp() {
    this.uiHandler.showModal()
  }

  joinRoomOnClick() {
    const { username, roomname } = this.uiHandler.getUserNameAndRoom()
    if (username && roomname) {
      this.joinChat(username, roomname)
    }
  }

  joinChat(username, roomname) {
    this.currentRoom = roomname
    this.currentUsername = username
    this.uiHandler.showChat()
    this.uiHandler.addProfileName(username)
    if (!this.uiHandler.roomExistsInList(this.currentRoom)) {
      this.uiHandler.addChatToList(this.currentRoom, 'Connected to room')
    }
    this.uiHandler.changeRoom(this.currentRoom)
    this.chatService.connect(SERVER_URL, `${ROOM_NAME}${roomname}`)
  }

  handleUserConnected(userId) {
    this.connectedUsers[userId] = userId
    this.updateConnectedUsersUI()
    this.chatHistory.addUserToRoom(this.currentRoom, userId)
    if (this.chatService.userID !== userId) {
      this.sendChatHistoryToUser(userId)
    }
  }

  handleUserDisconnected(userId) {
    delete this.connectedUsers[userId]
    this.updateConnectedUsersUI()
    this.chatHistory.removeUserFromRoom(this.currentRoom, userId)
  }

  handleRoomInfoReceived(info) {
    info.clients.forEach((userId) => {
      this.connectedUsers[userId] = userId
    })
    this.updateConnectedUsersUI()
  }

  handleMessageReceived(messageData, author_id) {
    if (messageData.room && messageData.room !== this.currentRoom) {
      return
    }
    if (messageData.type === 'init_private_chat') {
      const chatName = `Private chat with ${messageData.username}`
      const privateRoomName = `private_${Math.min(
        this.chatService.userID,
        author_id
      )}_${Math.max(this.chatService.userID, author_id)}`

      if (!this.uiHandler.roomExistsInList(privateRoomName)) {
        this.uiHandler.addChatToList(privateRoomName, chatName)
      }
    } else if (messageData.type === 'history') {
      if (!this.hasReceivedHistory) {
        messageData.content.forEach((historyMsg) => {
          this.uiHandler.addMessageToDOM(
            historyMsg.content,
            'left',
            historyMsg.username
          )
        })
        this.hasReceivedHistory = true
      }
    } else {
      this.chatHistory.addMessage(this.currentRoom, messageData)
      this.uiHandler.addMessageToDOM(
        messageData.content,
        'left',
        messageData.username
      )
    }
  }

  handleSendMessage() {
    const message = this.uiHandler.getInputMessage()
    if (message) {
      const msgObject = this.createMessageObject(message, this.currentRoom)
      this.chatHistory.addMessage(this.currentRoom, msgObject)
      const msgString = JSON.stringify(msgObject)
      if (this.currentRoom.startsWith('private_')) {
        const [_, senderID, recipientID] = this.currentRoom.split('_')
        const recipients =
          senderID === this.chatService.userID ? [recipientID] : [senderID]
        this.chatService.sendMessage(msgString, recipients)
      } else {
        this.chatService.sendMessage(msgString)
      }
      this.uiHandler.addMessageToDOM(message, 'right', this.currentUsername)
      this.uiHandler.clearInputField()
    }
  }

  sendMessageOnEnter(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      this.handleSendMessage()
    }
  }

  showAlertWithConnectedUsers() {
    const connectedUserIds = Object.keys(this.connectedUsers)
      .map((id) => `id_${id}`)
      .join(', ')
    alert(`Usuarios conectados: ${connectedUserIds}`)
  }

  changeRoom(roomName) {
    if (this.currentUsername && roomName) {
      this.currentRoom = roomName
      this.uiHandler.changeRoom(roomName, true)
      this.loadRoomHistory()
    }
  }

  loadRoomHistory() {
    const historyMessages = this.chatHistory.getHistory(this.currentRoom)
    this.uiHandler.clearChatList()
    historyMessages.forEach((msg) => {
      this.uiHandler.addMessageToDOM(
        msg.content,
        msg.username === this.currentUsername ? 'right' : 'left',
        msg.username
      )
    })
  }

  updateConnectedUsersUI() {
    const userCount = Object.keys(this.connectedUsers).length
    this.uiHandler.showStatus(`Online: ${userCount}`)
  }

  sendChatHistoryToUser(userId) {
    const historyMessages = this.chatHistory.getHistory(this.currentRoom)
    if (historyMessages.length > 0) {
      const historyMessage = {
        type: 'history',
        content: historyMessages,
        room: this.currentRoom
      }
      this.chatService.sendMessage(JSON.stringify(historyMessage), [userId])
    }
  }

  createMessageObject(message, room) {
    return {
      type: 'text',
      content: message,
      username: this.currentUsername,
      room
    }
  }
  handleUserClick(clickedUserName) {
    const clickedUserID = Object.keys(this.chatService.userNames).find(
      (key) => this.chatService.userNames[key] === clickedUserName
    )

    if (clickedUserID && clickedUserID !== this.chatService.userID) {
      const privateRoomName = this.getPrivateRoomName(clickedUserID)
      if (!this.uiHandler.roomExistsInList(privateRoomName)) {
        this.uiHandler.addChatToList(
          privateRoomName,
          `Private chat with ${clickedUserName}`
        )
      }
      this.initiatePrivateChat(clickedUserID, privateRoomName)
    }
  }

  getPrivateRoomName(otherUserID) {
    return `private_${Math.min(
      this.chatService.userID,
      otherUserID
    )}_${Math.max(this.chatService.userID, otherUserID)}`
  }

  initiatePrivateChat(recipientID, roomName) {
    const initiationMessage = {
      type: 'init_private_chat',
      content: roomName,
      username: this.currentUsername
    }
    this.chatService.sendMessage(JSON.stringify(initiationMessage), [
      recipientID
    ])
  }
}

new ChatApp()
