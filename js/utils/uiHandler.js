export default class UIHandler {
  constructor() {
    this.initializeElements()
    this.setupEventListeners()
  }

  initializeElements() {
    this.chatMain = document.querySelector('.chat-main__body')
    this.modal = document.querySelector('#userModal')
    this.inputMessage = document.querySelector('.chat-main__input')
    this.btnSend = document.querySelector('.chat-main__send')
    this.chatApp = document.querySelector('.chat-app')
    this.chatStatus = document.querySelector('.chat-main__status')
    this.roomModal = document.querySelector('.room-modal')
    this.chatName = document.querySelector('.chat-main__name')
    this.profileName = document.querySelector('.profile-name')
    this.chatList = document.querySelector('.chat-list') // Agregado
  }

  setupEventListeners() {
    this.chatMain.addEventListener('click', this.handleChatMainClick.bind(this))
    this.chatList.addEventListener('click', this.handleChatListClick.bind(this))
  }

  handleChatMainClick(event) {
    if (event.target.classList.contains('chat-main__message-text--user')) {
      this.handleUserClick(event.target.textContent)
    }
  }

  setChatListClickCallback(callback) {
    this.chatListClickCallback = callback
  }

  handleChatListClick(event) {
    const chatItem = event.target.closest('.chat-list__item')
    if (chatItem) {
      const roomName = chatItem.querySelector('.chat-list__name').textContent
      if (this.chatListClickCallback) {
        this.chatListClickCallback(roomName)
      }
    }
  }
  createRoom(roomName, isNew = false) {
    if (isNew) {
      this.clearChatList()
    }
    this.chatName.textContent = roomName
    this.highlightActiveChat(roomName)
  }

  changeRoom(roomName) {
    this.clearChatList()
    this.chatName.textContent = roomName
    this.highlightActiveChat(roomName)
  }

  roomExistsInList(roomName) {
    const exists = Array.from(
      this.chatList.querySelectorAll('.chat-list__name')
    ).some((chatNameElement) => chatNameElement.textContent === roomName)
    return exists
  }

  highlightActiveChat(roomName) {
    document.querySelectorAll('.chat-list__item').forEach((item) => {
      const isActive =
        item.querySelector('.chat-list__name').textContent === roomName
      item.classList.toggle('chat-list__item--active', isActive)
      if (isActive) {
        item.style.backgroundColor = '#c7c7c7'
      } else {
        item.style.backgroundColor = ''
      }
    })
  }
  updateOnlineUsersList(connectedUsers) {
    const userCount = Object.keys(connectedUsers).length
    console.log(`Hay ${userCount} usuarios conectados:`, connectedUsers)
    const statusText = `Online: ${userCount}`
    this.chatStatus.textContent = statusText
  }

  addChatToList(roomname, message) {
    const chatItem = document.createElement('li')
    chatItem.classList.add('chat-list__item')
    chatItem.innerHTML = `
      <article>
        <figure class="chat-list__figure">
          <img src="assets/chat-ui/default.png" alt="Chat Image">
        </figure>
        <div class="chat-list__details">
          <h3 class="chat-list__name">${roomname}</h3>
          <p class="chat-list__message">${message}</p>
        </div>
      </article>`
    this.chatList.appendChild(chatItem)
  }

  clearChatList() {
    this.chatMain.innerHTML = ''
  }

  handleUserClick(userName) {
    console.log('User name:', userName)
  }
  getInputMessage() {
    return this.inputMessage.value.trim()
  }
  addProfileName(username) {
    this.profileName.textContent = username
  }

  addMessageToDOM(message, side, username = '') {
    const messageDiv = this.createMessageElement(message, side, username)
    this.chatMain.appendChild(messageDiv)
    this.scrollToBottom(this.chatMain)
  }

  createMessageElement(message, side, username) {
    const messageDiv = document.createElement('div')
    messageDiv.classList.add(
      'chat-main__message',
      `chat-main__message--${side}`
    )
    messageDiv.innerHTML = `<p class="chat-main__message-text"><span class="chat-main__message-text--user">${username}</span>: ${message}</p>`
    return messageDiv
  }

  scrollToBottom(element) {
    element.scrollTop = element.scrollHeight
  }

  toggleDisplay(element, show) {
    element.style.display = show ? '' : 'none'
  }

  showModal() {
    this.toggleDisplay(this.chatApp, false)
    this.toggleDisplay(this.modal, true)
  }

  showChat() {
    this.toggleDisplay(this.chatApp, true)
    this.toggleDisplay(this.modal, false)
  }

  showStatus(status) {
    this.chatStatus.textContent = status
  }

  getRoomName() {
    const inputRoomname = document.querySelector('.modal__input--new')
    return inputRoomname.value.trim()
  }

  getUserNameAndRoom() {
    const inputUsername = document.getElementById('username')
    const inputRoomname = document.getElementById('roomname')
    return {
      username: inputUsername.value.trim(),
      roomname: inputRoomname.value.trim()
    }
  }

  clearInputField() {
    this.inputMessage.value = ''
  }

  setJoinRoomListener(callback) {
    document.querySelector('#joinRoom').addEventListener('click', callback)
  }

  setSendMessageListener(callback) {
    this.inputMessage.addEventListener('keypress', callback)
  }

  setSendMessageButtonListener(callback) {
    this.btnSend.addEventListener('click', callback)
  }
  setStatusClickListener(callback) {
    this.chatStatus.addEventListener('click', callback)
  }
}
