/**
 Coupler couples tabs with mirror groups.
 */
const Coupler = {
    couplings: {},
    onDecouple: (tabId, groupName) => {
    },
    onCouple: (tabId, groupName) => {
    },
    clear() {
        for (let k in this.couplings) {
            if (!this.couplings.hasOwnProperty(k)) {
                continue;
            }
            const coupling = this.couplings[k];
            this.removeGroup(coupling.group);
        }
    },
    hasTabCoupledTabs(tabId) {
        return this.getCoupledTabs(tabId).length > 0;
    },
    getCouplings() {
        return this.couplings;
    },
    getCoupledTabs(tabId) {
        let coupledTabs = [];
        const tabGroups = this.getTabCouplings(tabId)
        for (let k in tabGroups) {
            if (!tabGroups.hasOwnProperty(k)) {
                continue;
            }

            const group = tabGroups[k]
            if (group.tabs.filter((e) => e === tabId).length > 0) {
                coupledTabs = coupledTabs.concat(group.tabs.filter((e) => e !== tabId))
            }
        }

        return coupledTabs;
    },
    addGroup(group) {
        if (typeof this.couplings[group.groupName] === "undefined") {
            this.couplings[group.groupName] = {
                group: group,
                tabs: []
            }
        }
    },
    removeGroup(group) {
        const g = this.couplings[group.groupName];
        if (typeof g === "undefined") {
            return;
        }
        for (let k in g.tabs) {
            if (!g.tabs.hasOwnProperty(k)) {
                continue;
            }

            const tabId = g.tabs[k]
            this.onDecouple(tabId, g.groupName)
        }

        delete this.couplings[group.groupName]
    },
    coupleTabsWithGroup(group, tabs) {
        this.couplings[group.groupName].tabs = tabs
        for (let k in tabs) {
            if (!tabs.hasOwnProperty(k)) {
                continue;
            }

            const tabId = tabs[k]
            this.onCouple(tabId, group.groupName)
        }
    },
    decoupleTab(groupName, tabId) {
        this.couplings[groupName].tabs = this.couplings[groupName].tabs.filter((e) => e !== tabId)
        this.onDecouple(tabId, groupName)
    },
    getTabCouplings(tabId) {
        let tabCouplings = [];
        for (let k in this.couplings) {
            if (!this.couplings.hasOwnProperty(k)) {
                continue;
            }

            let coupling = this.couplings[k];
            if (coupling.tabs.filter((t) => t === tabId).length > 0) {
                tabCouplings.push(coupling)
            }
        }

        return tabCouplings;
    }
};

let coupler = null;

function decoupleTabFromGroups(tabId) {
    let tabCouplings = coupler.getTabCouplings(tabId);
    for (let k in tabCouplings) {
        if (!tabCouplings.hasOwnProperty(k)) {
            continue;
        }

        coupler.decoupleTab(tabCouplings[k].group.groupName, tabId)
    }
}

function sync() {
    if (!loadGeneralConfigAsObject().enabled) {
        return
    }

    syncConfig(loadCouplingsAsObject)

    let couplings = coupler.getCouplings();
    for (let k in couplings) {
        if (!couplings.hasOwnProperty(k)) {
            continue;
        }

        const coupling = couplings[k];
        coupler.coupleTabsWithGroup(coupling.group, findCoupledTabsForTabByUrlRegExList(allTabs, coupling.group.regExList))
    }
}

function syncConfig(getConfig) {
    const config = getConfig();
    for (let k in config) {
        if (!config.hasOwnProperty(k)) {
            continue;
        }

        let configGroup = config[k];
        coupler.addGroup(configGroup)
    }

    let couplings = coupler.getCouplings();
    for (let k in couplings) {
        if (!couplings.hasOwnProperty(k)) {
            continue;
        }

        let group = couplings[k].group;

        if (config.filter((g) => g.groupName === group.groupName).length === 0) {
            coupler.removeGroup(group)
        }
    }
}

function findCoupledTabsForTabByUrlRegExList(allTabs, regExList) {
    let matchingTabs = []

    for (let k in regExList) {
        if (!regExList.hasOwnProperty(k)) {
            continue;
        }

        const regExEntry = regExList[k];
        let m = getMatchingTabsByUrlRegEx(allTabs, regExEntry.regEx);
        matchingTabs = matchingTabs.concat(m);
    }

    return matchingTabs;
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

function initCoupling() {
    coupler = Object.create(Coupler)
}
