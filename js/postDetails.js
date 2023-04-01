getPost()

function getPost() {

    const id = getIdFromUrl()

    let url = `${baseUrl}/posts/${id}`

    axios.get(url)
        .then((response) => {
            const post = response.data.data

            let postsDiv = document.getElementById('posts')
            postsDiv.innerHTML = ''

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

            let avatar = ''

            let commentInput = ''
            if (user) {
                avatar = checkAvatar(user.profile_image, 'style="width:30px; height: 30px;" class="rounded-circle me-2"')
                commentInput = `
                    <div class="card p-3 mb-4 shadow">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="user d-flex flex-column w-100">
                                <div>
                                    <img src="${user.profile_image}" style="width:30px; height: 30px;" class="rounded-circle me-2">
                                    <small class="fw-bold text-primary">${user.username}</small>
                                </div>
                                <form>
                                    <input type='hidden' id='postId' value='${post.id}' />
                                    <div class="mt-3 mb-1">
                                        <textarea class="form-control" id="comment"></textarea>
                                    </div>
                                    <button type="button" onclick='storeComment()' class="btn btn-sm btn-primary float-end">comment</button>
                                </form>
                            </div>
                        </div>
                    </div>
                `
            }

            
            let comments = ``
            for (let comment of post.comments) {
                avatar = checkAvatar(comment.author.profile_image, 'style="width:30px; height: 30px;" class="rounded-circle me-2"')
                
                comments += 
                `
                    <div class="card p-3 mb-3 shadow">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="user d-flex flex-column">
                                <a href='profile.html?id=${comment.author.id}' class='text-dark'>
                                    ${avatar}
                                    <small class="fw-bold text-primary">${comment.author.username}</small>
                                </a>
                                <div>
                                    <small class="fw-bold ms-5">${comment.body}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            }

            let heading = ''
            if (comments) {
                heading = `<h5 class="mt-3 ms-1 text-center">All Comments</h5>`
            } else {
                heading = `<h5 class="mt-3 ms-1 text-center">There are not comments currently</h5>`
            }

            avatar = checkAvatar(post.author.profile_image, 'class="avatar" id="post-user-avatar"')

            let content = `
                <div class="card mb-4 shadow">
                    <h5 class="card-header d-flex justify-content-between align-content-center">
                        <a href='profile.html?id=${post.author.id}' class='text-dark'>
                            ${avatar}
                            <span id="post-user-name">${post.author.username}</span>
                        </a>
                        ${btnControl}
                    </h5>
                    <div class="card-body">
                        <div class='image'>
                            <img src='${post.image}' class='img-fluid'/>
                        </div>
                        <h5 class="card-title text-dark">${post.title}</h5>
                        <p class="card-text text-dark">${post.body}</p>
                    </div>
                    <div class="card-footer text-body-secondary">
                        <span>(${post.comments_count}) comments</span>
                        <span class='float-end'>${post.created_at}</span>
                    </div>
                </div>
                ${commentInput}
                ${heading}
                ${comments}
            `
            postsDiv.innerHTML = content
        });
}

function storeComment() {
    const comment = document.getElementById('comment').value
    const postId = document.getElementById('postId').value
    const token = localStorage.getItem('token')

    const url = `${baseUrl}/posts/${postId}/comments`
    const data = {
        body: comment
    } 
    const headers = {
        "authorization": `Bearer ${token}`
    }

    toggleLoader(true)
    axios.post(url, data, { headers: headers })
        .then((response) => {
            location.reload()
        })
        .catch((error) => {
            showAlert(error.response.data.message, 'danger')
            
        })
        .finally(() => {
            toggleLoader(false)
        })
}