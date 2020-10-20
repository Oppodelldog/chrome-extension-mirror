
function enableExtension() {
    try {
        sync();
    } catch (e) {
        console.error(e)
    }
}

function disableExtension() {
    try {
        coupler.clear();
    } catch (e) {
        console.error(e)
    }
}