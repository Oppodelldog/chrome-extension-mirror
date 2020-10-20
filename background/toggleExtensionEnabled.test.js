const rewire = require('rewire');
const sinon = require('sinon');
let moduleUnderTest;

describe("toggleExtensionEnabled", () => {
    beforeEach(() => {
        moduleUnderTest = rewire('./toggleExtensionEnabled.js');
    })

    test('enableExtension', () => {
        const sync = sinon.spy();
        moduleUnderTest.__set__('sync', sync);
        const enableExtension = moduleUnderTest.__get__('enableExtension');

        enableExtension()

        expect(sync.calledOnce).toBeTruthy()
    });

    test('disableExtension', () => {
        const coupler = sinon.spy();
        coupler.clear = sinon.spy();
        moduleUnderTest.__set__('coupler', coupler);
        const disableExtension = moduleUnderTest.__get__('disableExtension');

        disableExtension()

        expect(coupler.clear).toBeTruthy()
    });
})