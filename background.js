chrome.runtime.onInstalled.addListener(function() {
   chrome.tabs.create({url: "http://yatsiv.com/extensions/dilterbilter/welcome"});
});

chrome.action.onClicked.addListener((tab) => {
   chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['style.css']
  });

  // Execute script
  chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
   let iconPath = message.inputActivated ? 'icon-active-48.png' : 'icon-inactive-48.png';
   chrome.action.setIcon({ path: iconPath, tabId: sender.tab.id });
});

 if(chrome.runtime.setUninstallURL) {
   chrome.runtime.setUninstallURL('http://yatsiv.com/f/dilterbilter');
}