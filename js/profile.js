getUser()
getPosts()

document.getElementById('title-head').innerHTML = getUserInfo().username

function getUser() {
    const id = getIdFromUrl()

    const url = `${baseUrl}/users/${id}`

    axios.get(url)
        .then((response) => {
            const userInfo = response.data.data

            let userInfoDiv = document.getElementById('profile-userInfo')
            userInfoDiv.innerHTML = ''

            let avatar = checkAvatar(userInfo.profile_image, 'style="width: 100%;')

            let content = `
            <h5 class="card-header d-flex align-items-center justify-content-between">
                User Information
            </h5>
            <div class="card-body" id="profile-userInfo">
                <div class="row d-flex align-items-center flex-sm-column flex-md-row">
                    <div class="col-sm-12 col-md-3">
                        ${avatar}
                    </div>
                    <div class="col-sm-12 col-md-9">
                        <table class="table">
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>${userInfo.name ? userInfo.name: 'UnKnown'}</td>
                                </tr>
                                <tr>
                                    <th>Username</th>
                                    <td>${userInfo.username}</td>
                                </tr>
                                <tr>
                                    <th>Posts Count</th>
                                    <td>${userInfo.posts_count}</td>
                                </tr>
                                <tr>
                                    <th>Comments Count</th>
                                    <td>${userInfo.comments_count}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            `
            userInfoDiv.innerHTML = content
        });
}

function getPosts() {
    const id = getIdFromUrl()

    let url = `${baseUrl}/users/${id}/posts`

    axios.get(url)
        .then((response) => {
            const posts = response.data.data

            let postsDiv = document.getElementById('posts')
            postsDiv.innerHTML = ''

            for(let post of posts) {
                let user = getUserInfo()
                checkAuthorizer = user != null && post.author.id == user.id
                let btnControl = ''
                if (checkAuthorizer) {
                    btnControl = `
                        <div>
                            <button type='button' onclick='editModal("${encodeURIComponent(JSON.stringify(post))}")' class='btn btn-sm btn-success'>
                                <i class="bi bi-pencil-square"></i>
                                edit
                            </button>
                            <button type='button' onclick='deleteModal("${encodeURIComponent(JSON.stringify(post))}")' class='btn btn-sm btn-danger'>
                                <i class="bi bi-trash3-fill"></i>
                                delete
                            </button>
                        </div>
                    `
                }
                
                let avatar = checkAvatar(post.author.profile_image, 'class="avatar" id="post-user-avatar"')

                let content = `
                <div class="card mb-4">
                    <h5 class="card-header d-flex justify-content-between align-content-center">
                        <div>
                            ${avatar}
                            <span id="post-user-name">${post.author.username}</span>
                        </div>
                        ${btnControl}
                    </h5>
                    <a href='postDetails.html?id=${post.id}'>
                        <div class="card-body">
                            <div class='image'>
                                <img src='${post.image}' class='img-fluid'/>
                            </div>
                            <h5 class="card-title text-dark">${post.title}</h5>
                            <p class="card-text text-dark">${post.body}</p>
                        </div>
                    </a>
                    <div class="card-footer text-body-secondary">
                        <span>(${post.comments_count}) comments</span>
                        <span class='float-end'>${post.created_at}</span>
                    </div>
                </div>
                `
                postsDiv.innerHTML += content
            }
        });
}
