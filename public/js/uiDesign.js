const side_bar = document.querySelector('.side-bar')
const hamburger = document.querySelector('.hamburger button')
const logout = document.querySelector('.logout-option')
const logoutButton = document.querySelector('.logout')

hamburger.addEventListener('click', e => {
    side_bar.classList.toggle('side-bar-active')
})

logoutButton.addEventListener('click', e => {
    logout.classList.toggle('active')
})

document.addEventListener('click', e => {
    let isClicked = e.target.closest('.logout')
    if(logout.classList.contains('active')){
        if(isClicked === null) {
            logout.classList.remove('active')
        }
    }
    isClicked = e.target.closest('.hamburger')
    if(side_bar.classList.contains('side-bar-active')) {
        if(isClicked === null) {
            side_bar.classList.remove('side-bar-active')
        }
    }
})