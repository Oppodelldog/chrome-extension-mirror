
function enableExtension() {
    try {
        addEventListeners();
        sync();
    } catch (e) {
        console.error(e)
    }
}

function disableExtension() {
    try {
        removeListeners(chrome);
        coupler.clear();
    } catch (e) {
        console.error(e)
    }
}