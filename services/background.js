chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (!changeInfo.url) return;

    const url = changeInfo.url;

    if (!url.includes("meet.google.com")) return;
});