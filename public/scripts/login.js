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
		const data = await response.json();
		const passwordErr = document.getElementById("passwordErr")
		const usernameErr = document.getElementById("usernameErr")
		const password_field = document.getElementById("password")

        passwordErr.textContent = ""
        usernameErr.textContent = ""
        password_field.value = ""

		if (response.status == 201) {
			console.log("ok");
		} else if (response.status == 401) {
			passwordErr.textContent = data.error
		} else if (response.status == 404) {
            usernameErr.textContent = data.error
        }
	} catch (error) {
		console.error(error)
	}
})
