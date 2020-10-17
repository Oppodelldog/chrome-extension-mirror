/**
 Coupler couples tabs that match the same mirror group.
 */
const Coupler = {
    tabCouples: [],
    onDecouple: (tabId) => {
    },
    onCouple: (tabId) => {
    },
    hasTabCoupledTabs: function (tab) {
        return (typeof this.tabCouples[tab.id] !== "undefined" && this.tabCouples[tab.id]  !== 0);
    },
    addCouplesForTab(tab, couples) {
        if (typeof this.tabCouples[tab.id] !== "undefined") {
            if (coupler.isTabBlockedFromDetection(tab)) {
                this.tabCouples[tab.id] = [];
            }
        } else {
            this.onCouple(tab.id);
            this.tabCouples[tab.id] = [];
        }

        for (let k in couples) {
            if (!couples.hasOwnProperty(k)) {
                continue;
            }

            let tabId = couples[k];
            this.tabCouples[tab.id][k] = tabId;
            this.onCouple(tabId);
        }
    },
    removeCouplingForTab(tab) {
        delete this.tabCouples[tab.id];
    },
    isTabBlockedFromDetection(tab) {
        return (this.tabCouples[tab.id] === 0);
    },
    blockTabFromDetection(tab) {
        this.tabCouples[tab.id] = 0;
    },
    getCouples(tab) {
        return this.tabCouples[tab.id];
    },
    cleanCouplings(tab) {
        if (this.hasTabCoupledTabs(tab)) {
            const couples = this.getCouples(tab);
            for (let k in couples) {
                if (!couples.hasOwnProperty(k)) {
                    continue;
                }

                const coupledTabId = couples[k];
                this.removeCouplingForTab({id: coupledTabId});
                this.onDecouple(coupledTabId)
            }
        }
        this.removeCouplingForTab(tab);
        this.onDecouple(tab.id)
    }
};

const coupler = Object.create(Coupler)

function removeCouplesForTabAndItsCouples(tab) {
    coupler.cleanCouplings(tab)
}

function findCouplesForTab(tab, allTabs, getConfig) {
    // if tabId is marked to have no couple tabs, abort
    if (coupler.isTabBlockedFromDetection(tab)) {
        return [];
    }

    if (coupler.hasTabCoupledTabs(tab)) {
        return coupler.getCouples(tab);
    }
    coupler.blockTabFromDetection(tab);

    const config = getConfig();
    for (let k in config) {
        if (!config.hasOwnProperty(k)) {
            continue;
        }

        const configEntry = config[k];

        for (let r in configEntry.regExList) {
            if (!configEntry.regExList.hasOwnProperty(r)) {
                continue;
            }

            const regExEntry = configEntry.regExList[r];

            if (urlMatchRegEx(tab.url, regExEntry.regEx)) {
                findCoupledTabsForTabByUrlRegExList(tab, allTabs, configEntry.regExList);
            }
        }
    }

    if (coupler.hasTabCoupledTabs(tab)) {
        return coupler.getCouples(tab);
    }

    return [];
}

function findCoupledTabsForTabByUrlRegExList(tab, allTabs, regExList) {
    for (let k in regExList) {
        if (!regExList.hasOwnProperty(k)) {
            continue;
        }

        const regExEntry = regExList[k];
        findCoupledTabsForTabByUrlRegEx(tab, allTabs, regExEntry.regEx);
    }
}

function findCoupledTabsForTabByUrlRegEx(tab, allTabs, urlRegEx) {
    let coupledTabs = getMatchingTabsByUrlRegEx(allTabs, urlRegEx);
    coupledTabs = removeTabIdFromCouples(tab, coupledTabs)

    if (coupledTabs.length > 0) {
        coupler.addCouplesForTab(tab, coupledTabs);
    }
}

function removeTabIdFromCouples(tab, couples) {
    for (let k in couples) {
        if (!couples.hasOwnProperty(k)) {
            continue;
        }

        if (couples[k] === tab.id) {
            couples.splice(k, 1);
        }
    }

    return couples;
}

function getMatchingTabsByUrlRegEx(tabs, urlRegEx) {
    const matchingTabs = [];
    for (let k in tabs) {
        if (!tabs.hasOwnProperty(k)) {
            continue;
        }

        const tab = tabs[k];
        if (urlMatchRegEx(tab.url, urlRegEx)) {
            matchingTabs.push(tab.id);
        }
    }

    return matchingTabs;
}

function urlMatchRegEx(url, urlRegEx) {
    const regex = new RegExp(urlRegEx);
    const match = regex.exec(url);

    return match != null;
}

function isTabsIdInArray(tabId, tabIds) {
    for (let k in tabIds) {
        if (!tabIds.hasOwnProperty(k)) {
            continue;
        }

        if (tabIds[k] === tabId) {
            return true;
        }
    }

    return false;
}
