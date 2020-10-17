const rewire = require('rewire');
const code = rewire('./tabCoupling.js');

test('add/remove coupled tabs', () => {
    const coupler = code.__get__('coupler');

    const tabId = "1";
    const tab = {id: tabId};
    const couples = [{id: "a"}, {id: "b"}];

    coupler.removeCouplesForTab(tab)
    expect(coupler.tabCouples).toHaveLength(0);
    expect(coupler.hasTabCoupledTabs(tab)).toBeFalsy();

    coupler.addCouplesForTab(tab, couples);
    expect(coupler.tabCouples[tabId]).toEqual(couples);
    expect(coupler.hasTabCoupledTabs(tab)).toBeTruthy();
});

test('tab is blocked from detection', () => {
    const coupler = code.__get__('coupler');

    const tabId = "1";
    const tab = {id: tabId};

    expect(coupler.isTabBlockedFromDetection(tab)).toBeFalsy();
    coupler.blockTabFromDetection(tab)
    expect(coupler.isTabBlockedFromDetection(tab)).toBeTruthy();
});

test('findCouplesForTab with no configuration returns null', () => {
    const findCouplesForTab = code.__get__('findCouplesForTab');
    const coupler = code.__get__('coupler');

    const loadConfiguration = function () {
        return {};
    }
    const tabId = "1";
    const tab = {id: tabId, url: "http://test.com"};

    coupler.blockTabFromDetection(tab);

    expect(findCouplesForTab(tab, loadConfiguration)).toHaveLength(0);
});

test('findCouplesForTab for tab that is blocked from detection will return empty array', () => {
    const findCouplesForTab = code.__get__('findCouplesForTab');

    const loadConfiguration = function () {
        return {};
    }
    const tabId = "1";
    const tab = {id: tabId, url: "http://test.com"};

    expect(findCouplesForTab(tab, loadConfiguration)).toHaveLength(0);
});

test('findCouplesForTab if couples already have been set, they are returned ', () => {
    const findCouplesForTab = code.__get__('findCouplesForTab');
    const coupler = code.__get__('coupler');

    const loadConfiguration = function () {
        return {};
    }
    const tabId = "1";
    const tab = {id: tabId, url: "http://test.com"};
    const couples = [{id: "a"}, {id: "b"}];

    coupler.addCouplesForTab(tab, couples)

    expect(findCouplesForTab(tab, loadConfiguration)).toEqual(couples);
});

test('findCouplesForTab couples are found by matching mirror group configs against all tabs', () => {
    const findCouplesForTab = code.__get__('findCouplesForTab');

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
});