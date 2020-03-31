'use strict';
const input = document.querySelector('.time input');
const note = document.querySelector('.note');
const ok = document.querySelector('.time img');
const forbidHtml = document.querySelector('.forbidArr ul');
const engHtml = document.querySelector('.engArr ul');
let urlArr;
let engUrlArr;

chrome.storage.sync.get( null, (result) => {
  Array.isArray(result.urls) ?  urlArr = result.urls : urlArr = [];
  Array.isArray(result.eng) ? engUrlArr = result.eng : engUrlArr = [];

  showForbidUrls(urlArr);
  showEngUrls(engUrlArr);
  ok.addEventListener("click", handleOkClick);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  chrome.storage.sync.get( null, (result) => {
    Array.isArray(result.urls) ?  urlArr = result.urls : urlArr = [];
    Array.isArray(result.eng) ? engUrlArr = result.eng : engUrlArr = [];
  
    showForbidUrls(urlArr);
    showEngUrls(engUrlArr);
  });
});

function showForbidUrls (arr) {
    forbidHtml.innerHTML = arr.map( item => `<li><div class="del forbid"><img src="img/del.png"></div>'${item}'</li>`).join('');
    const delForbid = document.querySelectorAll('.forbid');
    delForbid.forEach( (x, idx) => x.addEventListener("click", ()=>removeForbidUrl(idx)));
}

function showEngUrls (arr) {
    engHtml.innerHTML =  arr.map( item => `<li><div class="del eng"><img src="img/del.png"></div>'${item}'</li>`).join('');
    const delEng = document.querySelectorAll('.eng');
    delEng.forEach( (x, idx) => x.addEventListener("click", ()=>removeEngUrl(idx)));
}

function removeForbidUrl (idx) {
  urlArr.splice(idx,1);
  showForbidUrls(urlArr);
  chrome.storage.sync.set({ 'urls': urlArr });
}

function removeEngUrl (idx) {
  engUrlArr.splice(idx,1);
  showEngUrls(engUrlArr);
  chrome.storage.sync.set({ 'eng': engUrlArr });
}

function handleOkClick () {
  console.log(input.value);
  const time = Number(input.value);
  input.value = '';
  if (time>0 && time<1440) {
    let sec = time * 60;
    note.innerHTML = `Czas ustawiony!`;
    chrome.storage.sync.set({ 'sec': sec });
  } else if (time<=0) {
    note.innerHTML = "Najmniej 1 minuta";
  } else if (time>1440) {
    note.innerHTML = "Nie ustawisz ponad 1440 minut (doby)";
  }
}