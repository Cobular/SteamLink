chrome.action.onClicked.addListener((tab) => {
    const url = `steam://openurl/${tab.url}`;

    sendUmamiEvent(new URL(tab.url));

    chrome.tabs.update(tab.id, { url: url }, () => {
        if (chrome.runtime.lastError) {
            console.error(`Error updating tab: ${chrome.runtime.lastError.message}`);
        } else {
            console.log(`Updated tab: ${tab.id}`);
        }
    });
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: "store.steampowered.com" }
                    }),
                    new chrome.declarativeContent.PageStateMatcher({
                        pageUrl: { hostEquals: "steamcommunity.com" }
                    })
                ],
                actions: [new chrome.declarativeContent.ShowAction()]
            }
        ]);
    });
});
