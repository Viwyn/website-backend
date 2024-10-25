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
                    ${blog.images ? 
                    `<div class="blog-thumbnail">
                        <div class="image-preview">
                            <img src="${blog.images[0].url}" alt="imageForeground" class="imgPreviewFg">
                            <img src="${blog.images[0].url}" alt="imageBackground" class="imgPreviewBg" undragable>
                        </div>
                    </div>` 
                    : ""}
                    <div class="blog-description" id="blog-description-${blog.id}"></div>
                    <div class="blog-author">
                        <img src="${blog.pfp ? blog.pfp : '/lib/placeholder.jpeg'}" alt="pfp">
                        <p>${blog.author}</p>
                    </div>
                </a>
                `

        blogContainer.innerHTML += cardHtml
        
        const blogDescriptionContainer = document.getElementById(`blog-description-${blog.id}`)
        const quill = new Quill(blogDescriptionContainer, {
            theme: 'snow',
            modules: {
                toolbar: false 
            },
            readOnly: true 
        })

        const editorContent = JSON.parse(blog.content)
        quill.setContents(editorContent)
    })
})