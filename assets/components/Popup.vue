<template>
    <div class="wrapper">
        <h1 class="title">Simple Toggle Sites</h1>
        <div class="buttons">
            <button type="button" class="state-off" :class="{'is-active': !active}" @click="setActive(false)">Off</button>
            <button type="button" class="state-on" :class="{'is-active': active}" @click="setActive(true)">On</button>
        </div>
        <div class="sites">
            <p>List your websites below, one per line</p>
            <textarea v-model="list" rows="8" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
            <button type="button" class="state-save" @click="saveList">Save Site List</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            active: true,
            list: "example.com",
            icons: {
                active: 'images/icon-48x48.png',
                inactive: 'images/icon-48x48-off.png'
            }
        }
    },
    created() {
        // to generate global variables
        // (results) is the callback function
        // can use chrome API even if we are using Vue because running inside extension window
        chrome.storage.sync.get(['toggleSitesActive', 'toggleSitesList'], (results) => {
            this.active = result.toggleSitesActive;
            this.list = result.toggleSitesList;
        })
    },
    methods: {
        // both functions null out any callback function
        setActive(active) {
            // sets active boolean value in chrome.storage
            this.active = active;
            chrome.storage.sync.set({
                toggleSitesActive: active
            }, () => {}); // null callback

            chrome.browserAction.setIcon({
                path: this.icons[active ? 'active' : 'inactive']
            })
        },
        saveList() {
            chrome.storage.sync.set({
                toggleSitesList: this.list
            }, () => {});
        }
    }
}
</script>
