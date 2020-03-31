const sidebar = document.createElement('div'); 
sidebar.setAttribute('class', 'info');
let timer = '';
sidebar.innerHTML = `<div class="arrow">></div>
										<p>Za chwilę zostaniesz przeniesiony na stronę do nauki angielskiego.</p>
										<span>Koniec czasu za:</span>
										<div class="timer"></div>`;
const timerDiv = sidebar.querySelector('.timer');
const arrow = sidebar.querySelector('.arrow');

setTimeout(() => { sidebar.classList.add("visible")}, 80);

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	timer = msg.time || `00:00:00`;
	sidebar.querySelector(".timer").innerHTML = timer;
	if (msg==="show") {
		sidebar.classList.add("visible");
		setTimeout(() => { sidebar.classList.remove("visible")}, 5000);
	} else if (msg==="hide") {
		sidebar.classList.remove("visible");
	}  
	sendResponse('executed');
});

function handleClick () {
	sidebar.classList.remove("visible");
}

document.body.insertBefore (sidebar, document.body.firstChild);
arrow.addEventListener("click", handleClick);