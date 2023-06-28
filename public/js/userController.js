let isAdmin = false
let naming = null 

const loginModal = document.getElementById('loginPanel')
const signupModal = document.getElementById('signupPanel')
const loginBack = document.getElementById('login-panel-back')
const signupBack = document.getElementById('signup-panel-back')

const cartImg = document.getElementById('cart-img')
const username = document.getElementById('nameInput')
const login = document.getElementById('loginInput')
const password = document.getElementById('passwordInput')
const slogin = document.getElementById('s_loginInput')
const spassword = document.getElementById('s_passwordInput')
const loginForm = document.getElementById('loginForm')
const signupForm = document.getElementById('signupForm')

function OnUserChanged(){
    cartImg.style.visibility = isAdmin? 'hidden' : 'visible'
    document.getElementById('userNameLabel').innerText = naming == null? '' : naming
    ShowAllCollers()
}

function openModal(form, back){
    form.style.visibility = 'visible'
    back.style.visibility = 'visible'
}

function closeModal(form, back){
    form.style.visibility = 'hidden'
    back.style.visibility = 'hidden'
}

function openLogin(){ openModal(loginModal, loginBack) }

function closeLogin(){ closeModal(loginModal, loginBack) }

function openSignup(){ openModal(signupModal, signupBack) }

function closeSignup(){ closeModal(signupModal, signupBack) }

function confirmLoginForm(){
    if(!checkLogin()) return
    
    sendLoginByFetch()
}

async function confirmSignupForm(){
    if(!checkSignup()) return

    await fetch(`/user/${slogin.value}`)
    .then(res => res.json())
    .then(count => {
        console.log(count)
        if(count.length !== 0){
            alert('Користувач з цим логіном вже існує')
            return
        } 
        
        sendSignupByFetch()

        closeSignup()
    })
    .catch(err => {
        console.log(err)
        return
    })
}

function checkLogin(){
    if(login.value.match(/^.+@.+\..+$/g) == null){
        alert('Потрібно ввести правильний логін (наприклад test@gmail.com)')
        return false
    }
    if(password.value === ''){
        notValidUser('пароль')
        return false
    }
    if(password.value.length < 8){
        alert('Пароль повинен містити як мінімум 8 символів')
        return false
    }

    return true
}

function checkSignup(){
    if(username.value === ''){
        notValidUser('ім\'я')
        return false
    }
    if(slogin.value.match(/^.+@.+\..+$/g) == null){
        alert('Потрібно ввести правильний логін (наприклад test@gmail.com)')
        return false
    }
    if(spassword.value === ''){
        notValidUser('пароль')
        return false
    }
    if(spassword.value.length < 8){
        alert('Пароль повинен містити як мінімум 8 символів')
        return false
    }

    return true
}

async function sendLoginByFetch(){
    await fetch(`/user/${login.value}/${password.value}`)
    .then(res => res.json())
    .then(user => {
        if(user[0].name === null || user[0].name === undefined){
            alert('Неправильний логіч або пароль')
            return
        }
        isAdmin = user[0].isAdmin
        naming = user[0].name
        saveUserInfo(user[0].login, user[0].password)
        OnUserChanged()
        loginForm.reset()
        closeLogin()
    })
    .catch(err => {
        alert('Неправильний логіч або пароль')
    });
}

async function sendSignupByFetch() {
    await fetch('/user', {
            method: 'POST',
            body: collectUserFormData(false)
    })
    .then(() => {
        isAdmin = false
        naming = username.value
        saveUserInfo(slogin.value, spassword.value)
        OnUserChanged()
        signupForm.reset()
    })
    .catch(err => {
        console.log(err)
    });
}

function SetUser(){
    let user_login = getCredentialFromCookie('login')
    let user_password = getCredentialFromCookie('password')

    if(user_login === undefined || user_password == undefined)
        return

    login.value = user_login
    password.value = user_password

    confirmLoginForm()
}

function saveUserInfo(user_login, user_password){
    let expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `login=${user_login}; expires=${expires.toUTCString()}; Secure;`
    document.cookie = `password=${user_password}; expires=${expires.toUTCString()}; Secure;`
}

function getCredentialFromCookie(name) {
    const encodedName = encodeURIComponent(name);
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
  
      if (cookie.startsWith(`${encodedName}=`)) {
        const value = cookie.substring(encodedName.length + 1);
        return decodeURIComponent(value);
      }
    }
}

function collectUserFormData(isLogin){
    let formData = new FormData(isLogin? loginForm : signupForm);
    return formData;
}

function notValidUser(text){
    alert('Потрібно ввести ' + text)
}