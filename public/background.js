chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.text) {
        chrome.storage.local.set({ selectedText: message.text }, function () {});
    }
});