const chrome = require("sinon-chrome");
const sinon = require("sinon")
const rewire = require('rewire');
let code = null;

describe("tabs", () => {
    beforeEach(() => {
        chrome.flush();
        code = rewire('./tabs.js');
    })

    test('initTabs', () => {
        const initTabs = code.__get__('initTabs');

        initTabs(chrome)

        expect(chrome.tabs.onUpdated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onActivated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onCreated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onRemoved.addListener.calledOnce).toBeTruthy();
    });

    test('tab onUpdated - adds tab', () => {
        const initTabs = code.__get__('initTabs');
        const allTabs = code.__get__('allTabs');

        let tabStub = {id: 1};

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onUpdated.dispatch(1, {}, tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
    });

    test('tab onUpdated - with stauts "complete" it calls refreshCouplesForTabAndItsCouples', () => {
        const initTabs = code.__get__('initTabs');

        let tabStub = {id: 1};
        let refreshSpy = sinon.spy()
        code.__set__('refreshCouplesForTabAndItsCouples', refreshSpy)

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onUpdated.dispatch(1, {status: "complete"}, tabStub)

        expect(refreshSpy.calledOnce).toBeTruthy()
    });

    test('tab onActivated - resolves tab, adds it and calls refreshCouplesForTabAndItsCouples', () => {
        const initTabs = code.__get__('initTabs');
        const allTabs = code.__get__('allTabs');

        let tabActiveInfo = {tabId: 1}

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onActivated.dispatch(tabActiveInfo)

        expect(chrome.tabs.get.calledOnce).toBeTruthy()
        expect(chrome.tabs.get.args[0][0]).toEqual(tabActiveInfo.tabId)

        let tabStub = {id: 2};
        let refreshSpy = sinon.spy()
        code.__set__('refreshCouplesForTabAndItsCouples', refreshSpy)

        chrome.tabs.get.args[0][1](tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
        expect(refreshSpy.calledOnce).toBeTruthy()
        expect(refreshSpy.args[0][0]).toEqual(tabStub)
    })

    test('tab onCreated - adds tab', () => {
        const initTabs = code.__get__('initTabs');
        const allTabs = code.__get__('allTabs');

        let tabStub = {id: 1};

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onCreated.dispatch(1, {}, tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
    })

    test('tab onRemoved - removes tab', () => {
        const initTabs = code.__get__('initTabs');
        const allTabs = code.__get__('allTabs');

        let tabStub = {id: 1};
        allTabs[1] = tabStub;

        initTabs(chrome)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);

        // noinspection JSUnresolvedFunction
        chrome.tabs.onRemoved.dispatch(1, {}, tabStub)

        expect(allTabs[tabStub.id]).toBeUndefined();
    })

})