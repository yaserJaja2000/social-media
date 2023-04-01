let currentPage = 1
let lastPage = 1
// Infinite Scroll //
window.addEventListener('scroll', () => {
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight
  if (endOfPage && currentPage < lastPage) {
        currentPage += 1
        getPosts(currentPage, false)
    }
})

setupUI()
getPosts()

function getPosts(page = 1, reload = true) {
    const url = `${baseUrl}/posts?limit=2&page=${page}`

    toggleLoader(true)
    axios.get(url)
        .then((response) => {
            toggleLoader(false)
            const posts = response.data.data

            let postsDiv = document.getElementById('posts')
            if (reload) {
                postsDiv.innerHTML = ''
            }
            
            lastPage = response.data.meta.last_page


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
                        <a href='profile.html?id=${post.author.id}' class='text-dark'>
                            ${avatar}
                            <span id="post-user-name">${post.author.username}</span>
                        </a>
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

