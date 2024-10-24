// title resize
document.addEventListener("DOMContentLoaded", function () {
	const titleTextArea = document.getElementById("title")
	const contentTextArea = document.getElementById("content")
	
	function inputResize(element, preferred = null) {
		element.style.height = "auto"
		
		if (!preferred) {
			element.style.height = element.scrollHeight + "px"
		} else {
			element.style.height = Math.max(element.scrollHeight, preferred) + "px"
		}
	}

	titleTextArea.addEventListener("input", () => {
		inputResize(titleTextArea)
	}) 
	quill.on('text-change', () => {
		inputResize(contentTextArea, 300)
	})
	window.addEventListener("resize", () => {
		inputResize(titleTextArea)
		inputResize(contentTextArea, 300)
	})

	inputResize(titleTextArea)
	inputResize(contentTextArea, 300)
})

// everything image
const carousel = document.querySelector('#image-carousel')
const imageDrop = document.getElementById('image-drop')
const fileInput = document.getElementById('images')
const track = document.querySelector('.carousel-track')
let slides = Array.from(track.children)

const nextBtn = document.querySelector('.carousel-button--right')
const prevBtn = document.querySelector('.carousel-button--left')
const addImgBtn = document.querySelector('.carousel-button--add')
const delBtn = document.querySelector('.carousel-button--delete')

const dotNav = document.querySelector('.carousel-nav')
let dots = Array.from(dotNav.children)

let slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0

let imageArray = []

// position the images
function positionSlides() {
	slides.forEach((slide, index) => {
		slide.style.left = `${slideWidth * index}px`
	})
}

//updates the slides array
function updateSlides() {
	slides = Array.from(track.children)
	dots = Array.from(dotNav.children)
	slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0

	slides.length > 0 ? imageDrop.style.display = 'none' : imageDrop.style.display = 'flex'

	if (slides.length > 1) {
		nextBtn.style.visibility = 'visible'
	} else {
		nextBtn.style.visibility = 'hidden'
		prevBtn.style.visibility = 'hidden'
	}

	if (slides.length === 0) {
		imageDrop.style.display = 'flex'
		carousel.style.display = 'none'
		track.style.transform = `translateX(0)`;
	}
}

positionSlides()

//image drag n drop
function addImg() {
	carousel.style.display = 'flex'
	const fileArray = Array.from(fileInput.files)
	fileArray.forEach(img => {
		// check if images are at max (10)
		if (slides.length >= 10) {
			addImgBtn.style.visibility = 'hidden'
			return
		}
		
		// add image to array
		imageArray.push(img)
		
		const fileUrl = URL.createObjectURL(img)

		const newSlide = `<li class="carousel-slide${slides.length === 0 ? " current-slide" : ""}">
                            <div class="image-preview">
                                <img src="${fileUrl}" alt="imageForeground" class="imgPreviewFg">
                                <img src="${fileUrl}" alt="imageBackground" class="imgPreviewBg" undragable>
                            </div>
                        </li>`

		const newDot = `<button class="carousel-indicator${dots.length === 0 ? " current-slide" : ""}"></button>`

		track.insertAdjacentHTML('beforeend', newSlide)
		dotNav.insertAdjacentHTML('beforeend', newDot)
		updateSlides()
		positionSlides()
	})
	fileInput.value = ""
}

fileInput.addEventListener("change", addImg)

imageDrop.addEventListener("dragover", e => {
	e.preventDefault()
})

imageDrop.addEventListener("drop", e => {
	e.preventDefault()
	fileInput.files = e.dataTransfer.files
	addImg()
})

// image preview
function moveToSlide (track, currentSlide, targetSlide) {
	if (!targetSlide) return
	// move to next slide
	track.style.transform = `translateX(-${targetSlide.style.left})`;

	// move current-slide class
	if (currentSlide) currentSlide.classList.remove("current-slide");
	targetSlide.classList.add("current-slide");

}

// next button
nextBtn.addEventListener("click", e => {
	e.preventDefault()

	const currentSlide = track.querySelector('.current-slide')
	const nextSlide = currentSlide.nextElementSibling
	const nextIndex = slides.indexOf(nextSlide)
	const currentDot = dotNav.querySelector('.current-slide')
	const nextDot = dots[nextIndex]

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
	const nextDot = dots[nextIndex]

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
// add button
addImgBtn.addEventListener("click", e => {
	e.preventDefault()

	fileInput.click()
})
// delete button
delBtn.addEventListener("click", e => {
	e.preventDefault()

	addImgBtn.style.visibility = 'visible'

	const currentSlide = track.querySelector('.current-slide')
	let nextSlide = currentSlide.previousElementSibling || currentSlide.nextElementSibling || null
	const nextIndex = slides.indexOf(nextSlide)
	const currentDot = dotNav.querySelector('.current-slide')
	const nextDot = dots[nextIndex]
	
	imageArray.pop(slides.indexOf(currentSlide))

	currentSlide.remove()
	currentDot.remove()
	positionSlides()
	moveToSlide(track, currentSlide, nextSlide)
	updateSlides()

	if (nextIndex === 0) {
		prevBtn.style.visibility = 'hidden'
	}
	if (nextIndex === slides.length - 1) {
		nextBtn.style.visibility = 'hidden'
	}

	if (nextSlide) {
		nextSlide.classList.add("current-slide")
	}

	if (nextDot) {
		nextDot.classList.add("current-slide")
	}
})

// upload post
document
.getElementById("postForm")
	.addEventListener("submit", async function (event) {
		event.preventDefault()

		const formData = new FormData()

		const title = document.getElementById("title").value
		// const content = document.getElementById("content").value
		
		const delta = quill.getContents()
		const content = JSON.stringify(delta)
		
		// Append the text data to the FormData object
		formData.append("title", title)
		formData.append("content", content)

		imageArray.forEach((image) => {
			formData.append('images', image)
		})

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
