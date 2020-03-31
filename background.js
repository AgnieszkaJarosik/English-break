let urlArr;
let secLeft;
let engSites; 
let countdown;

chrome.runtime.onInstalled.addListener(()=>{  
  urlArr = [];
  secLeft = 300;
  engSites = [
    'https://www.perfect-english-grammar.com/grammar-exercises.html',
    'https://www.bbc.co.uk/learningenglish/english/intermediate-grammar',
    'https://learnenglish.britishcouncil.org/grammar/beginner-to-pre-intermediate',
    'https://www.livemocha.co/',
  ];
  chrome.storage.sync.set({
    'urls': urlArr,
    'sec': secLeft,
    'eng': engSites
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab)=>{
  const currUrl = changeInfo.url;
  if (!urlArr || !secLeft || !engSites) {
    chrome.storage.sync.get( null, (result) => {
      Array.isArray(result.urls) ?  urlArr = result.urls : urlArr = [];
      secLeft = result.sec || 300;
      Array.isArray(result.eng) ? engSites = result.eng : engSites = ['https://www.perfect-english-grammar.com/grammar-exercises.html'];
    });
  }
  if (currUrl) {    
      const waste = urlArr.find( url => currUrl.includes(url));
      if (waste) {
        startTimer(tabId);
      } else {
        clearInterval(countdown);
      }
  }
});

chrome.tabs.onActivated.addListener((activeInfo)=>{
  chrome.tabs.getSelected(null,(tab)=> {
    const thisUrl = tab.url;
      const waste = urlArr.find( url => thisUrl.includes(url));
      if (waste) {
        startTimer(activeInfo.tabId);
      } else {
        clearInterval(countdown);
      }
 });
})

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {  
  clearInterval(countdown);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.urls) {
      if (changes.urls.newValue.length < changes.urls.oldValue.length) {
        urlArr = changes.urls.newValue;
        clearInterval(countdown);
      } else if (changes.urls.newValue.length > changes.urls.oldValue.length) {
        urlArr = changes.urls.newValue;
        chrome.tabs.getSelected(null,(tab)=>{
          startTimer(tab.id);
        });
      }
    } else if (changes.eng) {
      engSites = changes.eng.newValue;
    } else if (changes.sec) {
      secLeft = changes.sec.newValue;
    }
});

function startTimer (id) {
  clearInterval(countdown);
  const now = Date.now();
  const then = now + secLeft * 1000;
  displayTimeLeft(secLeft, id);
    
  countdown = setInterval(() => {
    secLeft = Math.round((then - Date.now()) / 1000);
    if (secLeft===6){
      try {
        chrome.tabs.sendMessage(id, 'isExecuted', {}, (resp)=>{
          if (resp!='executed'){
            chrome.tabs.executeScript({ file: 'contentscript.js' });
          } else if (resp==='executed') {
            chrome.tabs.sendMessage(id, 'show');
          }
        })
      } catch(err) {
        console.log(err);
      }
    } else if (secLeft>9) {   
      try {
        chrome.tabs.sendMessage(id, 'hide');
      } catch (err) {
        console.log(err);
      }
    }
    if(secLeft <= 0) {
      onTimeEnd(id);
    }
      displayTimeLeft(secLeft, id);
    }, 1000);
}

function displayTimeLeft(seconds, id) {
  const hours = Math.floor(seconds/3600);
  const left = seconds % 3600;
  const minutes = Math.floor(left / 60);
  const remainderSeconds = left % 60;
  const display = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
  try {
    chrome.tabs.sendMessage(id, {"time": display});
    chrome.runtime.sendMessage({"time": display});
  } catch (err) {
    console.log(err);
  }
}

function onTimeEnd (id) {
  chrome.storage.sync.get( null, (result) => {
    clearInterval(countdown);
    secLeft = result.sec || 300;
    const newURL = engSites[Math.floor(Math.random() * engSites.length)]; 
    console.log(secLeft);
    chrome.tabs.update(id, { url: newURL });
  });
}