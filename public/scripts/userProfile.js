const displayName = document.getElementById("user-display-name")
const userName = document.getElementById("user-username")
const pronouns = document.getElementById("user-pronouns")
const profilePic = document.getElementById("user-pfp")
const blogList = document.getElementById("user-blogs-list")
const loading = document.querySelector(".loading-overlay")
const userProfile = document.querySelector(".user-profile")
const socialsLinks = document.querySelector(".user-details-links")

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const user = await fetch(`/api/user/${username}`)
        const userData = await user.json()

        const blogs = await fetch(`/api/user/${username}/blogs`)
        const userBlogs = await blogs.json()

        const pfp = await fetch(`/api/image/${userData.pfp}`)
        const pfpUrl = await pfp.json()

        const socials = await fetch(`/api/user/${username}/socials`)
        const socialData = await socials.json()

        displayName.innerHTML = userData.displayName ? userData.displayName : userData.username
        userName.innerHTML = userData.username
        pronouns.innerHTML = userData.pronouns
        profilePic.src = pfpUrl.url

        socialData.socials.forEach(social => {
            const socialHtml = `
            <div class="user-social-icon">
                            <i class="fab fa-${social.social}"></i>
                            <a href="${social.link}" target="_blank" rel="noopener noreferrer">${social.social}</a>
                        </div>`

            socialsLinks.innerHTML += socialHtml
        })

        const profilePicLoadPromise = new Promise((resolve) => {
            profilePic.onload = () => {
                resolve()
            }
            profilePic.onerror = () => {
                resolve()
            }
        });


        userBlogs.forEach(blog => {
			const postTime = new Date(blog.created_at)
			const currTime = new Date()
			const diffTime = currTime - postTime

			const seconds = Math.floor(diffTime / 1000)
			const minutes = Math.floor(seconds / 60)
			const hours = Math.floor(minutes / 60)
			const days = Math.floor(hours / 24)

			function formatTimeAgo(seconds) {
				if (seconds < 60) {
					return `${seconds} second${seconds !== 1 ? "s" : ""} ago`
				} else if (seconds < 3600) {
					return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
				} else if (seconds < 86400) {
					return `${hours} hour${hours !== 1 ? "s" : ""} ago`
				} else {
					return `${days} day${days !== 1 ? "s" : ""} ago`
				}
			}

			const timeAgo = formatTimeAgo(seconds)

			const blogCardHtml = `<div class="user-blog-card">
                            <a class="user-blog-card-link" href="/blogs/post/${blog.id}"></a>
                            <div class="user-blog-card-title">
                                <h2 class="user-blog-card-title-text">${blog.title}</h2>
                                <h3 class="user-blog-card-time">${timeAgo}</h3>
                            </div>
                            <div class="user-blog-content" id="blog-description-${blog.id}"></div>
                        </div>`

            blogList.innerHTML += blogCardHtml

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

        await profilePicLoadPromise

        loading.style.display = "none"
        userProfile.style.display = "flex"
        console.log("loaded")

    } catch (err) {
        console.log(err)
    }
})
