const rewire = require('rewire');
const sinon = require('sinon');

let moduleUnderTest, initEventListeners, document, window, chrome, domUtil;
const domUtilResultStub = "domUtilResultStub"

describe("eventCapturing", () => {
    beforeEach(() => {
        domUtil = sinon.stub();
        domUtil.getDomPath = sinon.stub();
        domUtil.getDomPath.returns(domUtilResultStub);
        chrome = sinon.stub();
        chrome.extension = sinon.stub();
        chrome.extension.sendMessage = sinon.stub();
        document = sinon.stub();
        document.addEventListener = sinon.stub();
        window = sinon.stub();
        window.addEventListener = sinon.stub();
        moduleUnderTest = rewire('./eventCapturing.js');
        initEventListeners = moduleUnderTest.__get__('initEventListeners');
        moduleUnderTest.__set__('document', document)
        moduleUnderTest.__set__('window', window)
        moduleUnderTest.__set__('DomUtil', domUtil)
        moduleUnderTest.__set__('chrome', chrome)

        initEventListeners()
    })

    test('click', () => {
        let el = {id: "some-element"}
        let e = {detail: 1, srcElement: el, clientX: 10, clientY: 20, screenX: 30, screenY: 40}

        let expectedEventName = 'click';
        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
            mouseEventInfo: {clientX: 10, clientY: 20, screenX: 30, screenY: 40,}
        }

        callDocumentCallback(expectedEventName, 0, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(el)
    });

    test('focus', () => {
        let el = {id: "some-element"}
        let e = {srcElement: el}

        let expectedEventName = 'focus';
        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
        }

        callDocumentCallback(expectedEventName, 1, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(el)
    });

    test('mousedown', () => {
        let el = {id: "some-element"}
        let e = {detail: 1, srcElement: el, clientX: 10, clientY: 20, screenX: 30, screenY: 40}

        let expectedEventName = 'mousedown';
        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
            mouseEventInfo: {clientX: 10, clientY: 20, screenX: 30, screenY: 40,}
        }

        callDocumentCallback(expectedEventName, 2, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(el)
    });

    test('mouseup', () => {
        let el = {id: "some-element"}
        let e = {detail: 1, srcElement: el, clientX: 10, clientY: 20, screenX: 30, screenY: 40}

        let expectedEventName = 'mouseup';
        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
            mouseEventInfo: {clientX: 10, clientY: 20, screenX: 30, screenY: 40,}
        }

        callDocumentCallback(expectedEventName, 3, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(el)
    });

    test('mousemove', () => {
        let el = {id: "some-element"}
        let e = {detail: 1, srcElement: el, clientX: 10, clientY: 20, screenX: 30, screenY: 40}

        let expectedEventName = 'mousemove';
        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
            mouseEventInfo: {clientX: 10, clientY: 20, screenX: 30, screenY: 40,}
        }

        callDocumentCallback(expectedEventName, 4, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(el)
    });

    test('change', () => {
        let elementValueStub = "elementValueStub";
        let el = {id: "some-element", value: elementValueStub};
        let e = {target: el}

        let expectedEventName = 'change';
        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
            value: elementValueStub,
        }

        callDocumentCallback(expectedEventName, 5, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(el)
    });

    test('scroll on document', () => {
        let e = {target: document}
        window.scrollX = 10;
        window.scrollY = 20;

        let expectedEventName = 'scroll';
        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
        }

        callWindowCallback(expectedEventName, 0, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(document)
    });

    test('scroll on element', () => {
        let expectedEventName = "scroll";
        let el = {id: "some-element", scrollTop: 10, scrollLeft: 20};
        let e = {target: el}

        let expectedMessage = {
            elementPath: domUtilResultStub,
            event: expectedEventName,
            scrollX: el.scrollLeft,
            scrollY: el.scrollTop,
        }

        callWindowCallback(expectedEventName, 0, e);

        expect(chrome.extension.sendMessage.args[0][0]).toEqual(expectedMessage)
        expect(domUtil.getDomPath.args[0][0]).toEqual(el)
    });
})

function callDocumentCallback(expectedEventName, index, e) {
    callCallback(document, index, expectedEventName, e);
}

function callWindowCallback(expectedEventName, index, e) {
    callCallback(window, index, expectedEventName, e);
}

function callCallback(subject, index, expectedEventName, e) {
    let listenerCall = subject.addEventListener.getCalls()[index];
    let callback = listenerCall.args[1];

    expect(listenerCall.args[0]).toEqual(expectedEventName);
    expect(listenerCall.args[2]).toBeTruthy();
    callback(e)
}