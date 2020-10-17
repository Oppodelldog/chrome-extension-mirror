const chrome = require("sinon-chrome");
const sinon = require("sinon")
const rewire = require('rewire');
let moduleUnderTest = null;
let initTabs = null;
let allTabs = null;
let refreshCouplesForTabAndItsCouples = null;

describe("tabs", () => {
    beforeEach(() => {
        chrome.flush();
        moduleUnderTest = rewire('./tabs.js');
        initTabs = moduleUnderTest.__get__('initTabs');
        allTabs = moduleUnderTest.__get__('allTabs');
        refreshCouplesForTabAndItsCouples = sinon.spy()
        moduleUnderTest.__set__('refreshCouplesForTabAndItsCouples', refreshCouplesForTabAndItsCouples)
    })

    test('initTabs', () => {

        initTabs(chrome)

        expect(chrome.tabs.onUpdated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onActivated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onCreated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onRemoved.addListener.calledOnce).toBeTruthy();
    });

    test('tab onUpdated - adds tab', () => {
        let tabStub = {id: 1};

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onUpdated.dispatch(1, {}, tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
    });

    test('tab onUpdated - with status "complete" it calls refreshCouplesForTabAndItsCouples', () => {
        let tabStub = {id: 1};

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onUpdated.dispatch(1, {status: "complete"}, tabStub)

        expect(refreshCouplesForTabAndItsCouples.calledOnce).toBeTruthy()
        expect(refreshCouplesForTabAndItsCouples.args[0][0]).toEqual(tabStub)
    });

    test('tab onActivated - resolves tab, adds it and calls refreshCouplesForTabAndItsCouples', () => {
        let tabActiveInfo = {tabId: 1}

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onActivated.dispatch(tabActiveInfo)

        expect(chrome.tabs.get.calledOnce).toBeTruthy()
        expect(chrome.tabs.get.args[0][0]).toEqual(tabActiveInfo.tabId)

        let tabStub = {id: 2};

        chrome.tabs.get.args[0][1](tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
        expect(refreshCouplesForTabAndItsCouples.calledOnce).toBeTruthy()
        expect(refreshCouplesForTabAndItsCouples.args[0][0]).toEqual(tabStub)
    })

    test('tab onCreated - adds tab', () => {
        let tabStub = {id: 1};

        initTabs(chrome)

        // noinspection JSUnresolvedFunction
        chrome.tabs.onCreated.dispatch(tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
    })

    test('tab onRemoved - removes tab', () => {
        const initTabs = moduleUnderTest.__get__('initTabs');
        const allTabs = moduleUnderTest.__get__('allTabs');

        let tabStub = {id: 1};
        allTabs[1] = tabStub;

        initTabs(chrome)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);

        // noinspection JSUnresolvedFunction
        chrome.tabs.onRemoved.dispatch(tabStub)

        expect(allTabs[tabStub.id]).toBeUndefined();
    })
})