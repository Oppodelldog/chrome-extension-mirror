let injectJS = (file) => {
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL(file);
    s.onload = function () {
        this.remove();
    };
    (document.head || document.documentElement).appendChild(s);

}
injectJS('content/dom.js');
injectJS('content/eventHandling.js');
