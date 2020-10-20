const rewire = require('rewire');
const sinon = require('sinon');
let moduleUnderTest, receiveEventBroadcastFromBackgroundScript, domUtil, handleCouplingStatusChange;

const domUtilResultStub = "domUtilResultStub"

describe("receiveEventBroadcastFromBackgroundScript", () => {
    beforeEach(() => {
        moduleUnderTest = rewire('./eventDispatching.js');
        receiveEventBroadcastFromBackgroundScript = moduleUnderTest.__get__('receiveEventBroadcastFromBackgroundScript');
        handleCouplingStatusChange = sinon.spy();
        domUtil = sinon.stub();
        domUtil.findElementByPath = sinon.stub();
        domUtil.findElementByPath.returns(domUtilResultStub);
        moduleUnderTest.__set__('handleCouplingStatusChange', handleCouplingStatusChange);
        moduleUnderTest.__set__('DomUtil', domUtil);
    })

    test('handle coupling state update', () => {
        let request = {
            type: "COUPLING_STATUS_CHANGE"
        };

        receiveEventBroadcastFromBackgroundScript(request);

        expect(handleCouplingStatusChange.calledOnce).toBeTruthy();
        expect(handleCouplingStatusChange.args[0][0]).toEqual(request);
    });

    test('dispatch dom element event', () => {
        let dispatchDomElementEvent = sinon.spy();
        moduleUnderTest.__set__('dispatchDomElementEvent', dispatchDomElementEvent);
        let request = {
            elementPath: "some-path"
        };

        receiveEventBroadcastFromBackgroundScript(request);

        expect(domUtil.findElementByPath.calledOnce).toBeTruthy();
        expect(domUtil.findElementByPath.args[0][0]).toEqual(request.elementPath);
        expect(dispatchDomElementEvent.calledOnce)
        expect(dispatchDomElementEvent.args[0][0]).toEqual(request)
        expect(dispatchDomElementEvent.args[0][1]).toEqual(domUtilResultStub)
    });

    test('dispatch non dom element event', () => {
        let dispatchNonDomElementEvent = sinon.spy();
        moduleUnderTest.__set__('dispatchNonDomElementEvent', dispatchNonDomElementEvent);
        let request = {elementPath:''};

        receiveEventBroadcastFromBackgroundScript(request);

        expect(dispatchNonDomElementEvent.calledOnce)
        expect(dispatchNonDomElementEvent.args[0][0]).toEqual(request)
    });
})
