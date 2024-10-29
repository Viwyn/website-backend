console.log(username)

document.addEventListener("DOMContentLoaded", async () => {
    const user = await fetch(`/api/user/${username}`)
})