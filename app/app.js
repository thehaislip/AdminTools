new Vue({
    el: '#app',
    data: {
        title: 'Test Title',
        items: [
            { title: 'Tools' },
            { title: 'Manage Sites' },
            { title: 'Reset App Pools' }
        ],
        activeMenuItem : ""
    },
    computed: {
        showTools: function () {
            return this.activeMenuItem == 'Tools'
        },
        showResetAppPool: function () {
            return this.activeMenuItem == 'Reset App Pools'
        }
    },
    methods: {
        navigate(item) {
            this.activeMenuItem = item.title;
        }

    }
})