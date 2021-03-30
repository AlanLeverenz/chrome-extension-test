// when the extension is installed for the first time, set default values
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        toggleSitesActive: false,
        togglesitesList: 'example.com'
    }, () => {});
});

// set up the initial chrome storage values
let toggleSitesActive = false;
let togglesitesList = 'example.com';

// replace the initial values above with the ones from synced storage
chrome.storage.sync.get([
    'toggleSitesActive',
    'toggleSitesList'
], (result) => {
    toggleSitesActive = result.toggleSitesActive;
    togglesitesList = result.toggleSitesList;
});

// on each site request, block it if it's in toggleSitesList
chrome.webRequest.onBeforeRequest.addListener(
    (details) => {

        // if the toggle is inactive, don't block anything
        if (!toggleSitesActive) {
            return { cancel: false };
        }

        // determine if the url is in toggleSitesList
        let cancel = toggleSitesList.split(/\n/)
        .some(site => {
            let url = new URL(details.url);

            return Boolean(url.hostname.indexOf(site) !== -1);

        });

        return { cancel: cancel };
    },
    {
        urls: ["<all_urls>"]
    },
    [
        "blocking"
    ]
);

// any time that a storage item is updated, update the global variables
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.toggleSitesActive) {
            toggleSitesActive = changes.togglesitesActive.newValue;
        }
        if (changes.togglesitesList) {
            toggleSitesList = changes.togglesitesList.newValue;
        }
    }
})