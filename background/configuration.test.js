const rewire = require('rewire');

let moduleUnderTest, loadCouplings,
    loadCouplingsAsObject, saveCouplings,
    loadGeneralConfig, loadGeneralConfigAsObject,
    saveGeneralConfig = null;

let localStorage = null;
const couplingsStub = '{"couplingsStub":true}';
const generalConfigStub = '{"generalConfigStub":true}';
const storageKeyCoupling = "coupling";
const storageKeyGeneral = "general";

describe("tabs", () => {
    beforeEach(() => {
        localStorage = {}
        localStorage[storageKeyCoupling] = couplingsStub;
        localStorage[storageKeyGeneral] = generalConfigStub;

        moduleUnderTest = rewire('./configuration.js');
        moduleUnderTest.__set__('localStorage', localStorage)
        loadCouplings = moduleUnderTest.__get__('loadCouplings')
        loadCouplingsAsObject = moduleUnderTest.__get__('loadCouplingsAsObject')
        saveCouplings = moduleUnderTest.__get__('saveCouplings')
        loadGeneralConfig = moduleUnderTest.__get__('loadGeneralConfig')
        loadGeneralConfigAsObject = moduleUnderTest.__get__('loadGeneralConfigAsObject')
        saveGeneralConfig = moduleUnderTest.__get__('saveGeneralConfig')
    })

    test('loadCouplings', () => {
        expect(loadCouplings()).toEqual(couplingsStub)
    });

    test('loadCouplingsAsObject', () => {
        expect(loadCouplingsAsObject()).toEqual({"couplingsStub": true})
    });

    test('saveCouplings', () => {
        const expectedData = '{"test":123}';

        saveCouplings(expectedData)

        expect(localStorage[storageKeyCoupling]).toEqual(expectedData)
    });

    test('loadGeneralConfig', () => {
        expect(loadGeneralConfig()).toEqual(generalConfigStub)
    });

    test('loadGeneralConfigAsObject', () => {
        expect(loadGeneralConfigAsObject()).toEqual({"generalConfigStub": true})
    });

    test('saveGeneralConfig', () => {
        const expectedData = '{"test":456}';

        saveGeneralConfig(expectedData)

        expect(localStorage[storageKeyGeneral]).toEqual(expectedData)
    });
})