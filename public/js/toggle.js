let toggle= document.getElementsByClassName('navbar-toggler')[0]
let sidebar = document.getElementsByClassName('sidebar')[0]
let search = document.getElementsByClassName('search-bar')[0]
let searchIcon = document.getElementsByClassName('search-icon')[0]
let account = document.getElementsByClassName('account-icon')[0]
let cart = document.getElementsByClassName('cart-icon')[0]
let cancelBtn = document.getElementsByClassName('red-btn')[0]

toggle.addEventListener('click', () => {
    toggle.className = toggle.className == "navbar-toggler open"? 
    "navbar-toggler close" : "navbar-toggler open"
    checkToggle()
})

function hideSearchBar(){
    setDisplay('none', 'block', 'block', 'block')
}

function setDisplay(b_search, b_searchIcon, b_account, b_cart){
    search.style.display = b_search
    searchIcon.style.display = b_searchIcon
    account.style.display = b_account
    cart.style.display = b_cart
}

onresize = (event) => {
    if(innerWidth > 768){
        sidebar.style.display = 'block'
        sidebar.style.width = '300px'
        cancelBtn.style.display = 'none'
        search.style.height = 'auto'
        search.style.width = 'auto'
        setDisplay('flex', 'none', 'block', 'block')
    }
    else{
        checkToggle()
        cancelBtn.style.display = 'block'
        setDisplay('none', 'block', 'block', 'block')
    }
    
};

onresize()

function checkToggle(){
    if(toggle.className === "navbar-toggler open"){
        sidebar.style.display = 'block'
        sidebar.style.width = '100%'
    }
    else{
        sidebar.style.display = 'none'
        sidebar.style.width = 0
    }
}

function showSearchBar(){
    setDisplay('flex', 'none', 'none', 'none')
    search.style.height = '80%'
    search.style.width = '50%'
}
