const blogAuthor = document.getElementById('author-name')
const blogAuthorPfp = document.getElementById('author-pfp')
const blogTitle = document.getElementById('title')
const postAuthor = document.getElementById('author-name')
const postContent = document.getElementById('content')

const loading = document.querySelector('.loading-overlay')
const blogContainer = document.querySelector('.post-container')
const errorDiv = document.querySelector('.error')

document.addEventListener("DOMContentLoaded", async () => {
	try {
		const res = await (await fetch (`/api/blogs/post/${userId}`)).json()
		const blogData = await res[0]

		if (res.error) {
			throw new Error(res.error)
		}

		const title = blogData.title
		const images = blogData.images
		const content = blogData.content
		const author = blogData.author
		const pfp = blogData.pfp

		blogAuthor.textContent += author
		blogTitle.textContent += title

		const quill = new Quill(postContent, {
			theme: 'snow',
			modules: {
				toolbar: false 
			},
			readOnly: true 
		})

		const editorContent = JSON.parse(content)
		quill.setContents(editorContent)

		addImg(images)

		blogContainer.style.display = 'flex'
	} catch (err) {
		console.log(err)
		errorDiv.style.display = 'flex'
		errorDiv.textContent += err
	} finally {
		loading.style.display = 'none'
		positionSlides()
		updateSlides()
	}
})

// everything image
const carousel = document.querySelector('#image-carousel')
const track = document.querySelector('.carousel-track')
let slides = Array.from(track.children)

const nextBtn = document.querySelector('.carousel-button--right')
const prevBtn = document.querySelector('.carousel-button--left')
const addImgBtn = document.querySelector('.carousel-button--add')
const delBtn = document.querySelector('.carousel-button--delete')

const dotNav = document.querySelector('.carousel-nav')
let dots = Array.from(dotNav.children)

let slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0

// position the images
function positionSlides() {
    slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0
	slides.forEach((slide, index) => {
		slide.style.left = `${slideWidth * index}px`
	})
}

//updates the slides array
function updateSlides() {
	slides = Array.from(track.children)
	dots = Array.from(dotNav.children)
	slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0

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

// add images
function addImg(images) {
	carousel.style.display = 'flex'
	images.forEach(img => {
		const newSlide = `<li class="carousel-slide${slides.length === 0 ? " current-slide" : ""}">
                            <div class="image-preview">
                                <img src="${img.url}" alt="imageForeground" class="imgPreviewFg">
                                <img src="${img.url}" alt="imageBackground" class="imgPreviewBg" undragable>
                            </div>
                        </li>`

		const newDot = `<button class="carousel-indicator${dots.length === 0 ? " current-slide" : ""}"></button>`

		track.insertAdjacentHTML('beforeend', newSlide)
		dotNav.insertAdjacentHTML('beforeend', newDot)
		updateSlides()
		positionSlides()
	})
}

// image preview
function moveToSlide (track, currentSlide, targetSlide) {
	if (!targetSlide) return
	// move to next slide
	track.style.transform = `translateX(-${targetSlide.style.left})`;

    if (currentSlide === targetSlide) return

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

window.addEventListener("resize", () => {
	const currentSlide = track.querySelector('.current-slide')

    positionSlides()
    moveToSlide(track, currentSlide, currentSlide)
})