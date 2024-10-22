document.addEventListener("DOMContentLoaded", async () => {
    const blogContainer = document.getElementById("blogs")

    const res = await fetch ('/api/blogs')
    const blogs = await res.json()

    blogs.forEach((blog) => {
        const cardHtml = `
                <a class="blog-card" href="/blogs/post/${blog.id}">
                    <h2 class="blog-title">
                        ${blog.title}
                    </h2>
                    <div>
                        
                    </div>
                    <img class="blog-thumbnail" src="/lib/placeholder-hori.jpeg" alt="placeholder" loading="lazy">
                    <p class="blog-description">
                        ${blog.content}
                    </p>
                    <div class="blog-author">
                        <img src="${blog.pfp ? blog.pfp : '/lib/placeholder.jpeg'}" alt="pfp">
                        <p>${blog.author}</p>
                    </div>
                </a>
                `

        console.log(cardHtml)
        blogContainer.innerHTML += cardHtml
    })
})