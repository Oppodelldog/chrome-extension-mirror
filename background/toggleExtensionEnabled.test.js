const rewire = require('rewire');
const sinon = require('sinon');
let moduleUnderTest;

describe("toggleExtensionEnabled", () => {
    beforeEach(() => {
        moduleUnderTest = rewire('./toggleExtensionEnabled.js');
    })

    test('enableExtension', () => {
        const addEventListeners = sinon.spy();
        const sync = sinon.spy();
        moduleUnderTest.__set__('addEventListeners', addEventListeners);
        moduleUnderTest.__set__('sync', sync);
        const enableExtension = moduleUnderTest.__get__('enableExtension');

        enableExtension()

        expect(addEventListeners.calledOnce).toBeTruthy()
        expect(sync.calledOnce).toBeTruthy()
    });

    test('disableExtension', () => {
        const removeListeners = sinon.spy();
        const coupler = sinon.spy();
        coupler.clear = sinon.spy();
        moduleUnderTest.__set__('removeListeners', removeListeners);
        moduleUnderTest.__set__('coupler', coupler);
        const disableExtension = moduleUnderTest.__get__('disableExtension');

        disableExtension()

        expect(removeListeners.calledOnce).toBeTruthy()
        expect(coupler.clear).toBeTruthy()
    });
})