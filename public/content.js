window.addEventListener('mouseup', word);
function word() {
    let select = window.getSelection().toString();
    if (select.length > 0) {
        let message = {text: select};
        chrome.runtime.sendMessage(message);
    }
}