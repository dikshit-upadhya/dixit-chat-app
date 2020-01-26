const users = []

const addUser = (id, username, roomId) => {
    // improvise the username and roomId string
    username = username.trim().toLowerCase()
    roomId = roomId.trim().toLowerCase()
    if(!username || !roomId) {
        return {
            error: 'Username and Room Id are required!'
        }
    }
    // check for existing user
    const existingUser = users.find((ele) => ele.username === username && ele.roomId ===roomId)
    if(existingUser) {
        return {
            error: 'Someone else has already taken the username in this group!'
        }
    }
    // save the user to the database
    const user = {username, roomId, id}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex( ele => ele.id === id)
    if(index === -1){
        return {
            error: `User doesn't exist!`
        }
    }
    const removedUser = users.splice(index, 1)[0] 
    return {removedUser}
}

const getUser = (id) => {
    const user = users.find(ele => ele.id === id)
    return user
}

const getUserList = (roomId) => {
    const userList = users.filter( ele => ele.roomId ===roomId)
    return userList
}

module.exports = {
    addUser,
    removeUser,
    getUserList,
    getUser
}