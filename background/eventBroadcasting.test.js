const rewire = require('rewire');
const sinon = require('sinon');

let moduleUnderTest, chrome, coupler, receiveEventBroadcastFromContentScript = null;

describe("event broadcasting", () => {
    beforeEach(() => {
        moduleUnderTest = rewire('./eventBroadcasting.js');
        receiveEventBroadcastFromContentScript = moduleUnderTest.__get__('receiveEventBroadcastFromContentScript');
        chrome = sinon.stub();
        chrome.tabs = sinon.stub();
        chrome.tabs.sendMessage = sinon.stub();
        chrome.tabs.query = sinon.stub();
        coupler = sinon.stub();
        coupler.hasTabCoupledTabs = sinon.stub();
        coupler.getCoupledTabs = sinon.stub();

        moduleUnderTest.__set__('chrome', chrome)
        moduleUnderTest.__set__('coupler', coupler)
    })

    test('received messages from the active tab are broadcast to all connected tabs', () => {
        const tabId1 = 1
        const tabId2 = 2
        const tabId3 = 3
        const activeTabId = tabId1;
        let msg = {'test': true}
        let sender = {tab: {id: activeTabId}};
        mockActiveTabChromeQuery(activeTabId)
        stubHasCoupledTabs(true)
        stubCoupledTabs([tabId1, tabId2, tabId3])

        receiveEventBroadcastFromContentScript(msg, sender);

        expect(chrome.tabs.sendMessage.calledTwice).toBeTruthy();
        expect(chrome.tabs.sendMessage.args[0][0]).toEqual(tabId2);
        expect(chrome.tabs.sendMessage.args[0][1]).toStrictEqual(msg);
        expect(chrome.tabs.sendMessage.args[1][0]).toEqual(tabId3);
        expect(chrome.tabs.sendMessage.args[1][1]).toStrictEqual(msg);
    });

    function stubHasCoupledTabs(value) {
        coupler.hasTabCoupledTabs.returns(value);
    }

    function stubCoupledTabs(tabIds) {
        coupler.getCoupledTabs.returns(tabIds);
    }

    function mockActiveTabChromeQuery(tabId) {
        chrome.tabs.query = function (a, callback) {
            expect(a).toEqual({active: true, lastFocusedWindow: true})
            callback([{id: tabId}]);
        }
    }
})