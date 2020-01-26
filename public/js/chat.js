const socket = io()

const messageField = document.querySelector('#messageField')
const messageButton = document.querySelector('#messageButton')
const messageForm = document.querySelector('#messageForm')
const locationButtonForm = document.querySelector('#locationButtonForm')
const locationButton = document.querySelector('#locationButton')

const messageArea = document.querySelector('.message-display')
const sideBar = document.querySelector('.side-bar')

const {username, password:roomId} = Qs.parse(location.search, { ignoreQueryPrefix: true})

socket.on('message', message => {
    const messageTemplate = document.querySelector('.message-format').innerHTML
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    })
    messageArea.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', message => { 
    const messageTemplate = document.querySelector('.location-message-format').innerHTML
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('hh:mm a')
    })
    messageArea.insertAdjacentHTML('beforeend', html)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    messageButton.setAttribute('disabled', 'disabled')
    const value = messageField.value
    socket.emit('sendMessage', value , (error) => {
        if(error) {
            return console.log(error, 'cannot perform the required function!!')
        }
        console.log('Delivered!')
        messageField.value=''
        messageButton.removeAttribute('disabled')
    })
})

locationButtonForm.addEventListener('submit', e => {
    e.preventDefault()
    locationButton.setAttribute('disabled', 'disabled')
    if(!navigator.geolocation){
        return console.log('your browser does not support navigator and geolocation services!! Please update your current browser!!')
    }
    navigator.geolocation.getCurrentPosition( pos => {
        socket.emit('sendLocation', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        }, (error) => {
            if(error) {
                return console.log(error)
            }
            console.log('Delivered!')
            locationButton.removeAttribute('disabled')
        })
    })
})

socket.on('sidebar-content', ({roomId, userList}) => {
    const html = document.querySelector('.sidebar-content-format').innerHTML
    const sidebarTemplate = Mustache.render(html, {
        roomId,
        userList
    })
    sideBar.innerHTML=sidebarTemplate
})

socket.emit('join', {
    username, 
    roomId
}, (error) => {
    if(error) {
       alert(error, 'Sorry! :-(') 
       location.href='/'
    }
})