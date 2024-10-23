// upload post

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

// title resize

document.addEventListener("DOMContentLoaded", function () {
	const textarea = document.getElementById("title")

	function inputResize(element) {
		element.style.height = "auto"
		element.style.height = element.scrollHeight + "px"
	}

	textarea.addEventListener("input", () => {
		inputResize(textarea)
	}) 
	window.addEventListener("resize", () => {
		inputResize(textarea)
	})

	inputResize(textarea)
})

// image preview
const track = document.querySelector('.carousel-track')
const slides = Array.from(track.children)
const nextBtn = document.querySelector('.carousel-button--right')
const prevBtn = document.querySelector('.carousel-button--left')
const dotNav = document.querySelector('.carousel-nav')
const dots = Array.from(dotNav.children)

const slideWidth = slides[0].getBoundingClientRect().width

// position the images
slides.forEach((slide, index) => {
	slide.style.left = `${slideWidth * index}px`
});

function moveToSlide (track, currentSlide, targetSlide) {
	// move to next slide
	track.style.transform = `translateX(-${targetSlide.style.left})`;

	// move current-slide class
	currentSlide.classList.remove("current-slide");
	targetSlide.classList.add("current-slide");

}

// next button
nextBtn.addEventListener("click", e => {
	e.preventDefault()

	const currentSlide = track.querySelector('.current-slide')
	const nextSlide = currentSlide.nextElementSibling
	const nextIndex = slides.indexOf(nextSlide)
	const currentDot = dotNav.querySelector('.current-slide')
	const nextDot = dots[slides.indexOf(nextSlide)]

	if (nextSlide) {
		moveToSlide(track, currentSlide, nextSlide)
		currentDot.classList.remove("current-slide");
		nextDot.classList.add("current-slide");
		prevBtn.style.visibility = 'visible'
	} 

	if (nextIndex >= slides.length-1) {
		nextBtn.style.visibility = 'hidden'
	}
})
// prev button
prevBtn.addEventListener("click", e => {
	e.preventDefault()

	const currentSlide = track.querySelector('.current-slide')
	const nextSlide = currentSlide.previousElementSibling
	const nextIndex = slides.indexOf(nextSlide)
	const currentDot = dotNav.querySelector('.current-slide')
	const nextDot = dots[slides.indexOf(nextSlide)]

	if (nextSlide) {
		moveToSlide(track, currentSlide, nextSlide)
		currentDot.classList.remove("current-slide")
		nextDot.classList.add("current-slide")
		nextBtn.style.visibility = 'visible'
	} 
	if (nextIndex == 0) {
		prevBtn.style.visibility = 'hidden'
	}
})
