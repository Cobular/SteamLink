// Put all the javascript code here, that you want to execute in background.

async function sendUmamiEvent(url) {
    body = {
        "type": "event",
        "payload": {
            "website": "899ca76e-112a-4fcb-865a-6e75143b2efd",
            "hostname": url.hostname,
            "screen": "1x1",
            "language": navigator.language,
            "event_type": "click",
            "event_value": "steamlink-button",
            "url": url.pathname
        }
    }
    const res = await fetch("https://umami.cobular.com/api/collect", {
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "cors",
        "headers": {
            'Content-Type': 'application/json'
        },
    });
    return res.status
}


function onTabCreated(tab) {
    console.log(`Created new tab: ${tab.id}`)
}

function onTabError(error) {
    console.error(`Error creating tab: ${error}`)
}

browser.pageAction.onClicked.addListener((tabs) => {
    const url = `steam://openurl/${tabs.url}`

    sendUmamiEvent(new URL(tabs.url)).then(data => console.log(data))

    browser.tabs.update({
        url: url
    }).then(
        onTabCreated, onTabError
    )
})

chrome.tabs.onActivated.addListener(function (tabs) {
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
