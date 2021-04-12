// Put all the javascript code here, that you want to execute in background.

function onTabCreated(tab) {
  console.log(`Created new tab: ${tab.id}`)
}

function onTabError(error) {
  console.error(`Error creating tab: ${error}`)
}

browser.pageAction.onClicked.addListener((tabs) => {
  const url = `steam://openurl/${tabs.url}`
  console.log(url)
  browser.tabs.update({
    url: url
  }).then(
    onTabCreated, onTabError
  )
})

chrome.tabs.onActivated.addListener(function (tabs) {
  console.log(tabs)
  chrome.pageAction.show(tabs.tabId);
});

chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
        {
          // That fires when a page's URL contains a 'g' ...
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: {hostEquals: "store.steampowered.com"}
            }),
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: {hostEquals: "steamcommunity.com"}
            })
          ],
          // And shows the extension's page action.
          actions: [new chrome.declarativeContent.ShowPageAction()]
        }
      ]
    );
  });
});
