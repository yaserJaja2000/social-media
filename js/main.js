// include navbar
let nav = document.querySelector('.navbar-pure')
let navbar = `
<div class="logo">
    <a href='index.html' style='color:#fff'>Tarmez</a>
</div>
<ul class="nav-links">
    <input type="checkbox" id="checkbox_toggle" />    
    <label for="checkbox_toggle" class="hamburger">&#9776;</label>
    <div class="menu">
        <li class="btn">
            <a href="index.html">Home</a>
        </li>
        <li class="btn" id="btn-sign" data-bs-toggle="modal" data-bs-target="#register-modal" style="background-color: #4c9e9e;">
            <a class='text-light'>Login/SignUp</a>
        </li>
        <li class="profile">
            <a class="avatar-link">
                <img src="" class="avatar" id="dropdown-user-avatar">
                <span id="dropdown-user-name"></span>
            </a>
            <ul class="dropdown">
                <li onclick="showProfile()">My Profile</li>
                <li onclick="logout()">Logout</li>
            </ul>
        </li>
    </div>
</ul>
`
nav.innerHTML = navbar

// Show and Hide Dropdown 
let profile = document.querySelector('.profile')
let dropdown = document.querySelector('.profile .dropdown')

profile.onclick = function () {
    dropdown.classList.toggle('active')
    profile.classList.toggle('teal')
}

function toggleLoader(show = true) {
    if (show) {
        document.getElementById('loader').style.display = 'flex'
    } else {
        document.getElementById('loader').style.display = 'none'
    }
}

function closeModal(id) {
    const modal = document.getElementById(id)
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
}

function showAlert(customMessage, type)
{
    const alertPlaceholder = document.getElementById('success-alert')
    alertPlaceholder.innerHTML = ''
    alertPlaceholder.style.display = 'block'
    const alert = (message, type) => {
        const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div id='alert-show' class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')
    alertPlaceholder.append(wrapper)
    }
    alert(customMessage, type)
    setTimeout(() => {
        alertPlaceholder.style.display = 'none'
    }, 5000)
}

function getIdFromUrl() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const id = urlParams.get('id')
    return id
}

function getUserInfo() {
    let userInfo = null
    if (localStorage.getItem('userInfo')) {
        userInfo = JSON.parse(localStorage.getItem('userInfo'))
    }
    return userInfo
}

function checkAvatar(src, attributes = '') {
    let imageProfile = `<img src="images/notfound.jpg" ${attributes}">`
    if(Object.keys(src).length != 0) {
        imageProfile = `<img src="${src}" ${attributes}">`
    }
    return imageProfile
}

function setupUI() {
    const token = localStorage.getItem('token')
    const userInfo = getUserInfo()
    let btnSign = document.getElementById("btn-sign")
    let btnCreate = document.getElementById("btn-create-post")
    let name = document.getElementById("dropdown-user-name")
    let avatar = document.getElementById("dropdown-user-avatar")

    if (token) {
        profile.style.display = "block"
        if (btnCreate) {
            btnCreate.style.display = "flex"
        }
        btnSign.style.display = "none"
        name.innerHTML = userInfo.name
        avatar.src = userInfo.profile_image
    } else {
        profile.style.display = "none"
        btnSign.style.display = "block"
        if (btnCreate) {
            btnCreate.style.display = "none"
        }
    }
}
setupUI()

const baseUrl = "https://tarmeezacademy.com/api/v1"

function register() {
    const url = `${baseUrl}/register`

    let name = document.getElementById('name').value
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    let image = document.getElementById('image').files[0]
    
    const data = new FormData()
    data.append('name', name)
    data.append('username', username)
    data.append('password', password)
    data.append('image', image)

    toggleLoader(true)
    axios.post(url, data)
        .then((response) => {
            const token = response.data.token
            const userInfo = response.data.user
            localStorage.setItem('token', token)
            localStorage.setItem('userInfo', JSON.stringify(userInfo))

            closeModal('register-modal')
            setupUI()
            showAlert('New User Registered Successfully', 'success')
        })
        .catch((error) => {
            showAlert(error.response.data.message, 'danger')
        })
        .finally(() => {
            toggleLoader(false)
        })
}

function login() {
    const url = `${baseUrl}/login`

    let username = document.getElementById('username-login').value
    let password = document.getElementById('password-login').value

    const data = {
        username: username,
        password: password
    }

    toggleLoader(true)
    axios.post(url, data)
        .then((response) => {
            const token = response.data.token
            const userInfo = response.data.user
            localStorage.setItem('token', token)
            localStorage.setItem('userInfo', JSON.stringify(userInfo))

            closeModal('register-modal')
            setupUI()
            showAlert('Logged in Successfully', 'success')
        })
        .catch((error) => {
            showAlert(error.response.data.message, 'danger')
        })
        .finally(() => {
            toggleLoader(false)
        })
}

function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    showAlert('Logged out successfully', 'success')
    setupUI()
    location.href = "index.html"
}

function showProfile() {
    window.location = `profile.html?id=${getUserInfo().id}`
}

function createModal() {
    let modal = document.getElementById('create-update-post-modal')
    let titleModal = document.getElementById('create-update-title-modal')
    let submitModal = document.getElementById('create-update-submit-modal')
    let id = document.getElementById('id-post-input')
    let title = document.getElementById('title-post-input')
    let body = document.getElementById('body-post-input')

    titleModal.innerHTML = 'Create New Post'
    submitModal.innerHTML = 'Create'
    submitModal.classList.remove('btn-success')
    submitModal.classList.add('btn-primary')

    id.value = ''
    title.value = ''
    body.value = ''

    let postModel = new bootstrap.Modal(modal, {})
    postModel.toggle()
} 

function editModal(postObj) {
    let modal = document.getElementById('create-update-post-modal')
    let titleModal = document.getElementById('create-update-title-modal')
    let submitModal = document.getElementById('create-update-submit-modal')
    let post = JSON.parse(decodeURIComponent(postObj))
    let id = document.getElementById('id-post-input')
    let title = document.getElementById('title-post-input')
    let body = document.getElementById('body-post-input')
    
    titleModal.innerHTML = 'Update Post'
    submitModal.innerHTML = 'Update'
    submitModal.classList.remove('btn-primary')
    submitModal.classList.add('btn-success')

    id.value  = post.id
    title.value = post.title
    body.value = post.body
    
    let postModel = new bootstrap.Modal(modal, {})
    postModel.toggle()
}

function deleteModal(postObj) {
    let modal = document.getElementById('delete-post-modal')
    let post = JSON.parse(decodeURIComponent(postObj))
    let id = document.getElementById('id-post-input')

    id.value  = post.id

    let postModel = new bootstrap.Modal(modal, {})
    postModel.toggle()
}


function storeOrUpdatePost() {
    let id = document.getElementById('id-post-input').value
    let title = document.getElementById('title-post-input').value
    let body = document.getElementById('body-post-input').value
    let image = document.getElementById('image-post-input').files[0]
    const token = localStorage.getItem('token')

    isCreate = id == null || id == ""

    let url = ''

    const data = new FormData()
    data.append('title', title)
    data.append('body', body)
    data.append('image', image)

    const headers = {
        "authorization": `Bearer ${token}`
    }

    if (isCreate) {
        url = `${baseUrl}/posts`
        toggleLoader(true)
        axios.post(url, data, { headers: headers })
        .then((response) => {
            closeModal('create-update-post-modal')
            showAlert('New Post Has Been Created', 'success')
            getPosts()
        })
        .catch((error) => {
            showAlert(error.response.data.message, 'danger')
        })
        .finally(() => {
            toggleLoader(false)
        })
    } else {
        data.append('_method', 'put')
        url = `${baseUrl}/posts/${id}`
        toggleLoader(true)
        axios.post(url, data, {headers: headers })
            .then((response) => {
                closeModal('create-update-post-modal')
                showAlert('The Post Has Been Updated', 'success')
                getPosts()
            })
            .catch((error) => {
                showAlert(error.response.data.message, 'danger')
            })
            .finally(() => {
                toggleLoader(false)
            })
    }
}
function destroyPost() {
    const id = document.getElementById('id-post-input').value
    const token = localStorage.getItem('token')

    const url = `${baseUrl}/posts/${id}`

    const headers = {
        "authorization": `Bearer ${token}`
    }

    toggleLoader(true)
    axios.delete(url, {headers: headers})
        .then((response) => {
            closeModal('delete-post-modal')
            showAlert('The Post Has Been Deleted', 'success')
            getPosts()
        })
        .catch((error) => {
            showAlert(error.response.data.message, 'danger')
        })
        .finally(() => {
            toggleLoader(false)
        })
}