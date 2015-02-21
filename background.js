chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({ url: 'page.html' }, function() {});
});
