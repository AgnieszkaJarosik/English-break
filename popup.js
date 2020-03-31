const urlPlace = document.querySelector("#curr");
const addBtn = document.querySelector(".red");
const addEngBtn = document.querySelector(".green");
const countdown = document.querySelector(".countdown");
const options = document.querySelector('#go-to-options');
let domain;
let timer = `00:00:00`;
countdown.innerHTML = timer;

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const tab = tabs[0].url;
  const url = new URL(tab);
  domain = url.hostname;
  urlPlace.innerHTML = url;
});

function handleAddClick () {
    let urlArr;
    chrome.storage.sync.get(['urls'], result => {
      !result.urls ? urlArr = [] : urlArr = result.urls;
      const occured = urlArr.find( url => domain.includes(url));
      if (occured===undefined) { urlArr.push(domain)};
      addBtn.querySelector('p').innerHTML = `Strona dodana!`;
      addBtn.querySelector('p').classList.add('green');
      addBtn.querySelector('p').classList.remove('red');
      addBtn.querySelector('.add-forbid').innerHTML = '<img src="img/ok.png">';
      chrome.storage.sync.set({'urls': urlArr});
    });
}

function handleAddEngClick () {
    let urlEngArr;
    chrome.storage.sync.get(['eng'], result => {
      console.log(result);
      Array.isArray(result.eng) ?  urlEngArr = result.eng : urlEngArr = [];
      const occured = urlEngArr.find( url => domain.includes(url) );
      if (occured===undefined) { urlEngArr.push(domain)};
      addEngBtn.querySelector('p').innerHTML = `Strona dodana!`;
      addEngBtn.querySelector('.add-eng').innerHTML = '<img src="img/ok.png">';
      chrome.storage.sync.set({'eng': urlEngArr});
    });
}

chrome.runtime.onMessage.addListener(
  function(msg, sender, sendResponse) {
      timer = msg.time || `00:00:00`;
      countdown.innerHTML = timer;
  }
)

function handleOptionsClick () {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}

addBtn.addEventListener("click", handleAddClick);
addEngBtn.addEventListener("click", handleAddEngClick);
options.addEventListener("click", handleOptionsClick);