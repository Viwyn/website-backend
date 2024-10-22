const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
	e.preventDefault()
	try {
		const response = await fetch("/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: document.getElementById("username").value,
				password: document.getElementById("password").value,
			}),
		})
		const passwordErr = document.getElementById("passwordErr")
		const usernameErr = document.getElementById("usernameErr")
		const password_field = document.getElementById("password")

        passwordErr.textContent = ""
        usernameErr.textContent = ""
        password_field.value = ""

		if (response.status == 201) {
			console.log("ok")
			const data = await response.json()
			window.location.href = data.returnTo
		} else if (response.status == 401) {
			passwordErr.textContent = "Invalid Password"
		} else if (response.status == 404) {
            usernameErr.textContent = "User Not Found"
        }
	} catch (error) {
		console.error(error)
	}
})
