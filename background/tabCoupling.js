/*
	First scratch version
	methods here will find matching coupled tabs for the giveb tabId and tabUrl

	basically the following structure will be build:
	tabCouples[tabId]=[coupledTabsIds...]

	this will help the event broadcaster to find the tabs events musts be sent to

	the config currently is hard coded and should be moved into localStorage managed by popup.js
*/
const tabCouples = [];
/*
localStorage["coupling"] = JSON.stringify([
	{
		groupName :"Mongo",
		regExList :[ {regEx:".*mongos.*"} ]
	},
	{
		groupName:"Google",
		regExList :[ {regEx:".*google\\.de.*"} ,{regEx:".*google\\.fr.*"}, {regEx:".*google\\.ch.*"}]
	}	
]);*/

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        refreshCouplesForTabAndItsCouples(tab);
    }
});

chrome.tabs.onActivated.addListener(function (evt) {
    chrome.tabs.get(evt.tabId, function (tab) {
        refreshCouplesForTabAndItsCouples(tab);
    });
});

function refreshCouplesForTabAndItsCouples(tab) {
    if (typeof tabCouples[tab.id] !== "undefined") {
        const couples = tabCouples[tab.id];
        for (let k in couples) {
            if (!couples.hasOwnProperty(k)) {
                continue;
            }

            const coupledTabId = couples[k];
            removeCouplesForTab({id: coupledTabId});
        }
    }
    removeCouplesForTab(tab);

}

function findCouplesForTab(tab) {

    // if tabId is marked to have no couple tabs, abort
    if (isTabBlockedFromDetection(tab)) {
        //console.error("url not coupled " + tab.url);
        return null;
    }

    if (hasTabCoupledTabs(tab)) {
        //console.info("found tabCouples in cache " + tab.id);
        //console.log(tabCouples[tabId]);
        return tabCouples[tab.id];
    }

    blockTabFromDetection(tab);
    const config = JSON.parse(loadConfiguration());
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
                findCoupledTabsForTabByUrlRegExList(tab, configEntry.regExList);
            }
        }
    }
    return null;
}

function findCoupledTabsForTabByUrlRegExList(tab, regExList) {
    for (let k in regExList) {
        if (!regExList.hasOwnProperty(k)) {
            continue;
        }

        const regExEntry = regExList[k];
        findCoupledTabsForTabByUrlRegEx(tab, regExEntry.regEx);
    }
}

function hasTabCoupledTabs(tab) {
    return (typeof tabCouples[tab.id] !== "undefined");
}

function isTabBlockedFromDetection(tab) {
    return (tabCouples[tab.id] === 0);
}

function blockTabFromDetection(tab) {
    tabCouples[tab.id] = 0;
}

function removeCouplesForTab(tab) {
    delete tabCouples[tab.id];
}

function addCouplesForTab(tab, couples) {
    if (typeof tabCouples[tab.id] !== "undefined") {
        if (isTabBlockedFromDetection(tab)) {
            tabCouples[tab.id] = [];
        }
        for (let k in couples) {
            if (!couples.hasOwnProperty(k)) {
                continue;
            }

            tabCouples[tab.id][k] = couples[k];
        }
    } else {
        tabCouples[tab.id] = couples;
    }
}

function findCoupledTabsForTabByUrlRegEx(tab, urlRegEx) {
    console.debug("find tabCouples for tab " + tab.id + " url " + tab.url + " using regEx " + urlRegEx);
    chrome.tabs.query({}, function (allTabs) {
        let coupledTabs = getMatchingTabsByUrlRegEx(allTabs, urlRegEx);
        coupledTabs = removeTabIdFromCouples(tab, coupledTabs)

        if (coupledTabs.length > 0) {
            addCouplesForTab(tab, coupledTabs);
            console.log("found tabs for url " + tab.url);
            console.log(tabCouples)
        } else {
            console.log("found nothing");
        }
    });
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
            matchingTabs[tab.id] = tab.id;
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
