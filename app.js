const btn = document.querySelector('.chat-main__send')
const input = document.querySelector('.chat-main__input')

// TODO
const checkLength = (msg) => {
  console.log(msg.split(' ').length)
}

const handleMsg = () => {
  const msg = input.value
  const chat = document.createElement('div')
  const newMsg = checkLength(msg)
  chat.classList.add('chat-main__message')
  chat.innerHTML = msg
  const chatMain = document.querySelector('.chat-main__body')
  chatMain.appendChild(chat)
  input.value = ''
}

btn.addEventListener('click', handleMsg)
document.addEventListener('keypress', (e) => {
  e.key === 'Enter' && handleMsg()
})
