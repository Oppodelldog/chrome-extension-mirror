const chrome = require("sinon-chrome");
const sinon = require("sinon");
const rewire = require('rewire');
let moduleUnderTest = null;
let initTabs = null;
let allTabs = null;
let coupleTabsWithGroups = null;
let loadConfigurationAsObject = null;
let decoupleTabFromGroups = null;
let sync = null;

describe("tabs", () => {
    beforeEach(() => {
        chrome.flush();
        moduleUnderTest = rewire('./tabs.js');
        initTabs = moduleUnderTest.__get__('initTabs');
        allTabs = moduleUnderTest.__get__('allTabs');
        coupleTabsWithGroups = sinon.spy();
        moduleUnderTest.__set__('coupleTabsWithGroups', coupleTabsWithGroups);
        loadConfigurationAsObject = sinon.spy();
        moduleUnderTest.__set__('loadConfigurationAsObject', loadConfigurationAsObject);
        decoupleTabFromGroups = sinon.spy();
        moduleUnderTest.__set__('decoupleTabFromGroups', decoupleTabFromGroups);
        sync = sinon.spy();
        moduleUnderTest.__set__('sync', sync);
        initTabs(chrome)
    })

    test('initTabs', () => {
        expect(chrome.tabs.onUpdated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onActivated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onCreated.addListener.calledOnce).toBeTruthy();
        expect(chrome.tabs.onRemoved.addListener.calledOnce).toBeTruthy();
    });

    test('tab onUpdated - adds tab', () => {
        let tabStub = {id: 1};

        chrome.tabs.onUpdated.dispatch(tabStub.id, {status: "complete"}, tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);

        expect(sync.calledOnce).toBeTruthy();
    });


    test('tab onActivated - resolves tab, adds it', () => {
        let tabActiveInfo = {tabId: 1}

        chrome.tabs.onActivated.dispatch(tabActiveInfo)

        expect(chrome.tabs.get.calledOnce).toBeTruthy()
        expect(chrome.tabs.get.args[0][0]).toEqual(tabActiveInfo.tabId)

        let tabStub = {id: 2};

        chrome.tabs.get.args[0][1](tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
        expect(sync.calledOnce).toBeTruthy();
    })

    test('tab onCreated - adds tab', () => {
        let tabStub = {id: 1};

        chrome.tabs.onCreated.dispatch(tabStub)

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);
        expect(sync.calledOnce).toBeTruthy();
    })

    test('tab onRemoved - removes tab', () => {
        let tabId = 1;
        let tabStub = {id: tabId};
        allTabs[1] = tabStub;

        expect(allTabs[tabStub.id]).toStrictEqual(tabStub);

        chrome.tabs.onRemoved.dispatch(tabId)

        expect(allTabs[tabStub.id]).toBeUndefined();

        expect(decoupleTabFromGroups.calledOnce).toBeTruthy();
        expect(decoupleTabFromGroups.args[0][0]).toEqual(tabId);
    })
})