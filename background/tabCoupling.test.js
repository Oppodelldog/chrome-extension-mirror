const rewire = require('rewire');
const sinon = require('sinon');
let code = null;
let coupler = null;
let sync = null;

describe("tab couplings", () => {
    beforeEach(() => {
        code = rewire('./tabCoupling.js');
        initCoupling = code.__get__('initCoupling');
        sync = code.__get__('sync');

        initCoupling();
        coupler = code.__get__('coupler');
        coupler.onCouple = sinon.spy();
        coupler.onDecouple = sinon.spy();
    })

    test('sync', () => {
        const loadCouplingsAsObject = function () {
            return [
                {
                    "regExList": [
                        {"regEx": "www.github.com"}
                    ],
                    "groupName": "test-group"
                }
            ]
        };
        const loadGeneralConfigAsObject = function () {
            return {enabled: true}
        };
        let tab1 = {id: "1", url: "http://www.github.com"};
        let tab2 = {id: "b", url: "http://www.gitlab.com"};
        let tab3 = {id: "c", url: "https://www.github.com/Oppodelldog/chrome-extension-mirror"};
        const allTabs = [tab1, tab2, tab3];

        code.__set__("allTabs", allTabs)
        code.__set__("loadCouplingsAsObject", loadCouplingsAsObject)
        code.__set__("loadGeneralConfigAsObject", loadGeneralConfigAsObject)

        sync();

        const expectedCouplings = {
            'test-group': {
                group: {regExList: [{"regEx": "www.github.com"}], groupName: 'test-group'},
                tabs: ['1', 'c']
            }
        };

        expect(coupler.couplings).toEqual(expectedCouplings);

        expect(coupler.onCouple.callCount).toEqual(2);
        expect(coupler.onCouple.args[0][0]).toEqual("1");
        expect(coupler.onCouple.args[1][0]).toEqual("c");
    })
})