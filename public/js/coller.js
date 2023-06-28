class Coller{
    constructor(name, price, owner, type, power, loud, material, image){
        this.name = name
        this.price = price
        this.owner = owner
        this.type = type
        this.power = power
        this.loud = loud
        this.material = material
        this.image = image
    }

    getOldPrice(){
        return Math.round(this.price + (this.price / 10))
    }
}

async function sendByFetch() {
    await fetch('/coller', {
            method: 'POST',
            body: collectFormData()
    });
}

let cartPanel = document.getElementById('cart-panel')
let cartContainer = document.getElementById('cart-container')
let itemsCount = document.getElementById('countOfItems')
itemsCount.parentElement.style.display = 'none'
cartPanel.style.visibility = 'hidden'

let collerId = document.getElementById('collerId')
let itemname = document.getElementById('item-name')
let price = document.getElementById('price')
let creator = document.getElementById('creator') 
let cooling_type = document.getElementById('cooling_type')
let power = document.getElementById('power')
let loud = document.getElementById('loud')
let material = document.getElementById('material')
let photo_pick = document.getElementById('photo_pick')

let deleteBtn = document.getElementById('deleteBtn')
deleteBtn.style.display = 'none'

const form = document.getElementById('modalForm')

document.getElementById('cart-img').addEventListener('click', () =>
    cartPanel.style.visibility = cartPanel.style.visibility == 'hidden'? 'visible' : 'hidden')

function confirmModal(){
    if(itemname.value == '') {
        notValid('Назва')
        return;
    }
    if(price.value.match(/^[0-9]+(\.[0-9]{1,2})?$/g) == null) {
        notValid("Ціна")
        return;
    }
    if(creator.value == '') {
        notValid("Назва виробника")
        return;
    }
    if(power.value == '' || Number(power.value) < 0) {
        notValid("Розсіювальна потужність")
        return;
    }
    if(loud.value == '' || Number(loud.value) < 0) {
        notValid("Рівень шуму")
        return;
    }
    if(document.getElementById('formImage').src === '') {
        alert('Потрібно вибрати картинку')
        return;
    }
    
    sendByFetch().then(() =>{
        console.log('fetch is sent')

        ShowAllCollers()
    })
    .catch(err =>{
        console.log(err)
    })
    
    closeModalPanel()
    refreshContentContainer()
}

async function updateColler(){
    await fetch(`/coller/${id}`, {
        method: 'POST',
        body: collectFormData()
    })
}

let pageIndex = 0
let pageMax = 1

function openPage(offset, index = null){
    if(pageIndex + offset < 0 || pageIndex + offset > pageMax) return
    if(index !== null)
        pageIndex = index
    pageIndex += offset
    document.getElementById('currentLink').innerHTML = `<a class="page-link">${pageIndex+1}</a>`
    ShowAllCollers()
}

async function setPagination(){
    await fetch(`/coller`)
    .then(res => res.json())
    .then(data => {
        let maxLink = document.getElementById('maxLink')
        maxLink.innerHTML = `<a class="page-link">${data+1}</a>`
        maxLink.addEventListener('click', () => openPage(0, data))
        pageMax = data
    })
}

async function ShowAllCollers(){
    await fetch(`/coller/page/${pageIndex}`)
    .then((res) => res.json())
    .then((data) => {
        
    for(let filter of data){
        if(!ownersArr.has(filter.owner))
            ownersArr.set(filter.owner, true)
        if(!typeArr.has(filter.type))
            typeArr.set(filter.type, true)
    }
    fillSideBar()
    refreshContentContainer(data)
    })
}

function collectFormData(){
    let formData = new FormData(form);
    return formData;
}

function notValid(text){
    alert(text + ' не підлягає формату')
}

let modalPanel = document.getElementById('modal-panel')
let modalPanelBack = document.getElementById('modal-panel-back')

function openModalPanel(id = null){
    modalPanel.style.visibility = 'visible'
    modalPanelBack.style.visibility = 'visible'
    if(id !== null){
        deleteBtn.style.display = 'block'
        getCollerById(id)
    }
    else{
        collerId.value = null
    }
}

deleteBtn.addEventListener('click', () => {
    let isDel = confirm('Чи справді ви бажаєте видалити цей товар?')
    if(isDel)
        deleteColler(document.getElementById('collerId').value)
    closeModalPanel()
}) 

async function deleteColler(id){
    await fetch(`/coller/${id}`, {
        method: 'POST'
    }).then(res => res.json())
    .then(data => ShowAllCollers(data))
}

async function getCollerById(id){
    await fetch(`/coller/${id}`)
    .then((res) => res.json())
    .then(data => {
        collerId.value = data._id
        itemname.value = data.name
        price.value = data.price
        creator.value = data.owner
        cooling_type.value = data.type
        power.value = data.power
        loud.value = data.loud
        material.value = data.material
        document.getElementById('formImage').src = data.image
        document.getElementById('oldImagePath').value = data.image
    })
}

function closeModalPanel(){
    modalPanel.style.visibility = 'hidden'
    modalPanelBack.style.visibility = 'hidden'
    document.getElementById('formImage').removeAttribute("src") 
    form.reset();
}

let contentContainer = document.getElementsByClassName('content-row')[0]

let addItem =   `<div class="p-2 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                    <div class="new-item" onclick="openModalPanel()">
                        <div class="plus-icon">
                            <span class="arrow"></span>
                            <span class="arrow"></span>
                        </div>
                        <p>Добавити новий товар</p>
                    </div>
                </div>`

let collerArr = []

let ownersArr = new Map()
let typeArr = new Map()

function fillSideBar(){
    let ownerSidebar = document.getElementById('sidebarCreator')
    let typeSidebar = document.getElementById('sidebarType')

    ownerSidebar.innerHTML = ''
    typeSidebar.innerHTML = ''

    for(let item of ownersArr.keys()){
        ownerSidebar.innerHTML += `<input type="checkbox" checked="true" style="margin-right: 10px;"
        onchange="ownersArr.set('${item}', this.checked); refreshContentContainer(collerArr);">${item}</input><br>`;
    }
    for(let item of typeArr.keys()){
        let item_name
        if(item === 'air') item_name = 'Повітряна'
        else if (item === 'water') item_name = 'Водяна'
        typeSidebar.innerHTML += `<input type="checkbox" checked="true" style="margin-right: 10px;"
        onchange="typeArr.set('${item}', this.checked); refreshContentContainer(collerArr);">${item_name}</input><br>`;
    }
}

function refreshContentContainer(data){
    contentContainer.innerHTML = ''
    if(isAdmin)
        contentContainer.innerHTML += addItem
    collerArr = []
    for(let item of data){
        collerArr.push(item)
        if(!ownersArr.has(item.owner) || ownersArr.get(item.owner) === false) continue
        if(!typeArr.has(item.type) || typeArr.get(item.type) === false) continue
        let temp = getItem(item)
        contentContainer.innerHTML += temp
    }
}

let buyItems = []

async function buyItem(id){
    await fetch(`/coller/${id}`)
    .then((res) => res.json())
    .then(data => {
        buyItems.push({name: data.name, price: data.price, image: data.image, count: 1})
        refreshCartPanel()
    })
}

function deleteBuyItem(index){
    buyItems.splice(index, 1)
    refreshCartPanel()
}

function refreshCartPanel(){
    cartContainer.innerHTML = ''
    let index = 0
    let sum = 0
    itemsCount.innerText = buyItems.length
    itemsCount.parentElement.style.display = buyItems.length === 0? 'none' : 'block'
    for(let data of buyItems){
        cartContainer.innerHTML += 
        `<div class="cart-item">
            <img src="${data.image}"/>
            <p>${data.name}</p>
            <input type="number" min="1" id="cart-item-count" value="${data.count}" onchange="buyItems[${index}].count = this.value"/>
            <p>${data.price}$</p>
            <button class="cancel-button" onclick="deleteBuyItem(${index})">Видалити</button>
        </div>`
        sum += data.price * data.count
        index++
    }
    document.getElementById('total-price').innerText = `Усього: ${sum}$`
}

function getItem(coller){
    let svg = isAdmin? `<svg xmlns="http://www.w3.org/2000/svg" class="svg-icon" style="width: 2em; height: 2em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1"><path d="M834.3 705.7c0 82.2-66.8 149-149 149H325.9c-82.2 0-149-66.8-149-149V346.4c0-82.2 66.8-149 149-149h129.8v-42.7H325.9c-105.7 0-191.7 86-191.7 191.7v359.3c0 105.7 86 191.7 191.7 191.7h359.3c105.7 0 191.7-86 191.7-191.7V575.9h-42.7v129.8z"/><path d="M889.7 163.4c-22.9-22.9-53-34.4-83.1-34.4s-60.1 11.5-83.1 34.4L312 574.9c-16.9 16.9-27.9 38.8-31.2 62.5l-19 132.8c-1.6 11.4 7.3 21.3 18.4 21.3 0.9 0 1.8-0.1 2.7-0.2l132.8-19c23.7-3.4 45.6-14.3 62.5-31.2l411.5-411.5c45.9-45.9 45.9-120.3 0-166.2zM362 585.3L710.3 237 816 342.8 467.8 691.1 362 585.3zM409.7 730l-101.1 14.4L323 643.3c1.4-9.5 4.8-18.7 9.9-26.7L436.3 720c-8 5.2-17.1 8.7-26.6 10z m449.8-430.7l-13.3 13.3-105.7-105.8 13.3-13.3c14.1-14.1 32.9-21.9 52.9-21.9s38.8 7.8 52.9 21.9c29.1 29.2 29.1 76.7-0.1 105.8z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16"> <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/> </svg>`
    return `<div class="p-2 col-sm-6 col-md-6 col-lg-4 col-xl-3">
                <div class="shop-item">
                    <img src="${coller.image}" alt="cooler" width="90%">
                    <div class="shop-item-info"> 
                        <h3>${coller.name}</h3>
                        <p class="discount">${Math.round(coller.price + (coller.price / 10))}$</p>
                    </div>
                    <div class="shop-footer">
                        <p class="price">${coller.price}$</p>
                        <div class="cart-btn" ${isAdmin? `onclick="openModalPanel('${coller._id}')"` : `onclick="buyItem('${coller._id}')"`}> 
                            ${svg}                 
                        </div>
                    </div>
                </div>
            </div>`
}