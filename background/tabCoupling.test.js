const rewire = require('rewire');
const sinon = require('sinon');
let coupler = null;
let findCouplesForTab = null;

describe("tab couplings", () => {
    beforeEach(() => {
        const code = rewire('./tabCoupling.js');
        coupler = code.__get__('coupler');
        findCouplesForTab = code.__get__('findCouplesForTab');
    })
    test('add/remove coupled tabs', () => {
        const tabId = "1";
        const tab = {id: tabId};
        const couples = ["a", "b"];

        coupler.removeCouplingForTab(tab)
        expect(coupler.tabCouples).toHaveLength(0);
        expect(coupler.hasTabCoupledTabs(tab)).toBeFalsy();

        coupler.addCouplesForTab(tab, couples);
        expect(coupler.tabCouples[tabId]).toEqual(couples);
        expect(coupler.hasTabCoupledTabs(tab)).toBeTruthy();
    });

    test('add/remove coupled tabs - callbacks are called', () => {
        coupler.onCouple = sinon.spy();
        coupler.onDecouple = sinon.spy();

        const tabId = "1";
        const tab = {id: tabId};
        const couples = ["a", "b"];

        coupler.addCouplesForTab(tab, couples);
        expect(coupler.onCouple.callCount).toEqual(3)
        expect(coupler.onCouple.args[0][0]).toEqual(tabId)
        expect(coupler.onCouple.args[1][0]).toEqual(couples[0])
        expect(coupler.onCouple.args[2][0]).toEqual(couples[1])

        coupler.cleanCouplings(tab)
        expect(coupler.onDecouple.callCount).toEqual(3)
        expect(coupler.onDecouple.args[0][0]).toEqual(couples[0])
    });

    test('tab is blocked from detection', () => {
        const tabId = "1";
        const tab = {id: tabId};

        expect(coupler.isTabBlockedFromDetection(tab)).toBeFalsy();
        coupler.blockTabFromDetection(tab)
        expect(coupler.isTabBlockedFromDetection(tab)).toBeTruthy();
    });

    test('findCouplesForTab with no configuration returns null', () => {
        const loadConfiguration = function () {
            return {};
        }
        const allTabs = [];
        const tabId = "1";
        const tab = {id: tabId, url: ""};

        expect(findCouplesForTab(tab, allTabs, loadConfiguration)).toHaveLength(0);
    });

    test('findCouplesForTab for tab that is blocked from detection will return empty array', () => {
        const loadConfiguration = function () {
            return {};
        }
        const allTabs = [];
        const tabId = "1";
        const tab = {id: tabId, url: ""};

        coupler.blockTabFromDetection(tab);

        expect(findCouplesForTab(tab, allTabs, loadConfiguration)).toHaveLength(0);
    });

    test('findCouplesForTab if couples already have been set, they are returned ', () => {
        const loadConfiguration = function () {
            return {};
        }
        const allTabs = [];
        const tabId = "1";
        const tab = {id: tabId, url: ""};
        const couples = ["a", "b"];

        coupler.addCouplesForTab(tab, couples)

        expect(findCouplesForTab(tab, allTabs, loadConfiguration)).toEqual(couples);
    });

    test('findCouplesForTab couples are found by matching mirror group configs against all tabs', () => {
        const loadConfiguration = function () {
            return [
                {
                    "regExList": [
                        {"regEx": "www.github.com"}
                    ],
                    "groupName": "test-group"
                }
            ]
        };
        const tabId = "a";
        const tab = {id: tabId, url: "http://www.github.com"};
        const allTabs = [
            {id: "b", url: "http://www.gitlab.com"},
            {id: "c", url: "https://www.github.com/Oppodelldog/chrome-extension-mirror"},
        ];

        // tab "a" and "c" match the regEx pattern from config "test-group"
        const expectedId = allTabs[1].id;

        expect(findCouplesForTab(tab, allTabs, loadConfiguration)).toEqual([expectedId]);
    })
})