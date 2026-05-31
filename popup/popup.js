document.getElementById('create-timer').addEventListener("click", () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("../form_page.html")
    })
})