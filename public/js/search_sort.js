let searchBtn = document.getElementById('searchBtn')
let searchText = document.getElementById('search')
let sortBtn = document.getElementById('sorting')

function SearchPredicate(item, search){
    return item.includes(search)
}

function compareNames(a, b){
    if(a.name < b.name) return -1
    else if(a.name > b.name) return 1
    else return 0
}

function comparePrice(a, b, asc = true){
    if(a.price < b.price) return -1
    else if(a.price > b.price) return 1
    else return 0
}

searchBtn.addEventListener('click', () => {
    ShowAllCollers().then(data => {
        if(searchText.value == '')
            return
        let tempArr = []
        collerArr.forEach(element => {
            if(SearchPredicate(element.name, searchText.value))
                tempArr.push(element)
        });
        refreshContentContainer(tempArr)
    })
})

sortBtn.addEventListener('change', () => {
    let tempArr = [...collerArr]
    switch(sortBtn.value){
        case 'name':
            tempArr.sort(compareNames)
            break
        case 'name_d':
            tempArr.sort(compareNames)
            tempArr.reverse()
            break
        case 'price':
            tempArr.sort(comparePrice)
            break
        case 'price_d':
            tempArr.sort(comparePrice)
            tempArr.reverse()
            break
    }
    refreshContentContainer(tempArr)
})
