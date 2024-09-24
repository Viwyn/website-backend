function showSidebar() {
	const sidebar = document.querySelector(".nav-sidebar");

	sidebar.style.display = "flex";
	sidebar.classList.toggle("open");
}

function hideSidebar() {
	const sidebar = document.querySelector(".nav-sidebar");

	sidebar.classList.toggle("open");
}

const obfuscatedElement = document.querySelector(".obfuscated");

function getRandomChar() {
	const chars = "ⅳ℅℃ℶⅉⅮ⅔℔ↁ⅓⅖⅑⅍ⅽ℆ⅵⅴÅ";
	return chars[Math.floor(Math.random() * chars.length)];
}

function obfuscateText(text) {
	return text
		.split("")
		.map((char) => getRandomChar())
		.join("");
}

let delay = 8; //in seconds
let intervalId;

setTimeout(() => {
	intervalId = setInterval(() => {
		const originalText = obfuscatedElement.textContent;
		obfuscatedElement.textContent = obfuscateText(originalText);
	}, 50);
}, delay * 1000);

const experience_url = "https://viwyn.com/api/experience";

//add experience & projects on load
document.addEventListener("DOMContentLoaded", function () {
	const experience_container = document.getElementById("timeline");
	fetch(experience_url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		})
		.then((jsonData) => {
			// change the duration of the animation of the line
			const stylesheet = document.styleSheets[3];
			const rules = stylesheet.cssRules;

			for (let i = 0; i < rules.length; i++) {
				if (rules[i].selectorText === ".timeline::after") {
					rules[
						i
					].style.animation = `move-line ${jsonData.length}s linear forwards`;
					break;
				}
			}

			// add all the experience that was returned from database
			jsonData.forEach((item, index) => {
				var startYear = new Date(item.startDate).getFullYear();
				var endYear =
					item.endDate != null ? new Date(item.endDate) : "present";

				const direction = index % 2 === 0 ? "left" : "right";
				const html = `
                    <div class="timecard ${direction}">
                        <img src="${item.img}" alt="placeholder">
                        <div>
                            <h2>${item.name}</h2>
                            <small>${startYear} - ${endYear}</small>
                            <p>${item.description}.</p>
                        </div>
                    </div>
                `;
				experience_container.innerHTML += html;
			});

			//add delay to each element added
			const parent = document.getElementById("timeline");
			const children = Array.from(parent.children);

			for (let i = 0; i < parent.childElementCount; i++) {
				const delay = i * 1;
				children[i].style.animationDelay = `${delay}s`;
			}
		})
		.catch((error) => {
			console.error(error);
		});

	const project_container = document.getElementById("project-list");
	const projects_url = 'http://viwyn.com/api/projects'

	fetch(projects_url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		})
		.then((jsonData) => {
			for (var i = 0; i < jsonData.length; i++){
				console.log(jsonData[i])
				const html = `
				<div class="project-container">
                    <div class="project-title">${jsonData[i]['name']}</div>
                    <div class="project-description">${jsonData[i]['description']}</div>
                    <div class="project-languages">
                        <div>languages</div>
                        <div>languages</div>
                    </div>
                    <div class="project-stats">
                        <div>${jsonData[i]['watchers_count']} watchers</div>
                        <div>${jsonData[i]['forks_count']} forks</div>
                        <div>${jsonData[i]['stargazers_count']} stars</div>
                    </div>
                    <div>
                        <a class="project-button" href="${jsonData[i]['html_url']}" target="_blank" rel="noopener noreferrer">
                            Code
                        </a>
                    </div>
                </div>
				`;

				project_container.innerHTML += html
			}
		})
		.catch((error) => {
			console.error(error);
		});
});

//rotate pfp on hover
const pfp = document.getElementById("pfp")

document.addEventListener("mousemove", (e) => {
	rotateElement(e, pfp);
})

function rotateElement(event, element) {
	//get mouse pos
	const x = event.clientX;
	const y = event.clientY;

	//get middle
	const rect = element.getBoundingClientRect();
	const middleX = rect.left + rect.width / 2;
	const middleY = rect.top + rect.height / 2;

	//get offset from middle
	const offsetX = ((x - middleX) / middleX) * 45;
	const offsetY = ((y - middleY) / middleY) * 45;

	element.style.setProperty("--rotateX", -1 * offsetY + "deg");
	element.style.setProperty("--rotateY", offsetX + "deg");
}

