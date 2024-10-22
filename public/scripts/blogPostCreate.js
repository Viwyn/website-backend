document
.getElementById("postForm")
	.addEventListener("submit", async function (event) {
		event.preventDefault()

		const formData = new FormData()

		const title = document.getElementById("title").value
		const content = document.getElementById("content").value
		const images = document.getElementById("images").files

		// Append the text data to the FormData object
		formData.append("title", title)
		formData.append("content", content)

		for (let i = 0; i < images.length; i++) {
			formData.append("images", images[i])
		}

		try {
			const response = await fetch("/blogs/post/create", {
				method: "POST",
				body: formData,
			})

			if (response.ok) {
				const result = await response.json()
				console.log("Post created:", result)
				alert("Post created successfully!")

				// Optionally, you can redirect or update the page here
			} else {
				console.error("Error creating post:", response.statusText);
				alert("Failed to create post.")
			}
		} catch (error) {
			console.error("Network error:", error);
			alert("An error occurred. Please try again.")
		}
	})
