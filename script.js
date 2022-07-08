const searchButton = document.querySelector('#search_line')
const list = document.querySelector('.repos_list')
const autocomBox = document.querySelector('.autocom_box')
const searchInput = document.querySelector('.searchinput')
const reposList = document.querySelector('.repos_list')

function get_data(searchText) {
    return fetch(`https://api.github.com/search/repositories?q=${searchText}&per_page=5`)
        .then(responce => responce.json())
        .then(data => {
            autocomBox.innerHTML = ''
            const fragment = document.createDocumentFragment()
            data.items.forEach(item => {
                const suggest1 = createItemList(item)
                suggest1.addEventListener('click', e => {
                    searchButton.value = ''
                    autocomBox.innerHTML = ''
                    createRepo(item)
                })
                fragment.appendChild(suggest1)
            })
            autocomBox.appendChild(fragment)
        })
        .catch(e => console.log("Превышено количество запросов, подождите"))
}

const debounce = (fn, debounceTime) => {
    let permission;
    return function () {
        clearTimeout(permission);
        permission = setTimeout(() => fn.apply(this, arguments), debounceTime);
    };
};

const debounce1 = debounce(get_data, 300)

function createItemList(item) {
    const suggest = document.createElement('li')
    suggest.innerText = item.name
    suggest.classList.add('selected')
    return suggest
}

function createRepo(obj){
    const repo = document.createElement('div')
    const repoInfo = document.createElement('div')
    const repoDeleteBtn = document.createElement('img')
    const nameRepo = document.createElement('p')
    const nameOwner = document.createElement('p')
    const starsRepo = document.createElement('p')
    nameRepo.innerHTML = `<b>Repository</b> - ${obj.name}` 
    nameOwner.innerHTML = `<b>Name</b> - ${obj.owner.login}`
    starsRepo.innerHTML = `<b>Stars</b> - ${obj.stargazers_count}`
    repoDeleteBtn.setAttribute('src', 'cancel.png')
    repoInfo.appendChild(nameRepo)
    repoInfo.appendChild(nameOwner)
    repoInfo.appendChild(starsRepo)
    repoInfo.classList.add('repo_info')
    repo.appendChild(repoInfo)
    repo.appendChild(repoDeleteBtn)
    repo.classList.add('repo')
    reposList.appendChild(repo)
    repoDeleteBtn.addEventListener('click', e => {
        reposList.removeChild(repo)
    })
    
}

searchButton.addEventListener('keyup', (e) => {
    if (e.target.value && e.key != "Backspace") {
        debounce1(e.target.value)
    } else {
        autocomBox.textContent = ''
    }
})



