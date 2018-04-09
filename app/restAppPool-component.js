var cloneDeep = require("clone-deep");
Vue.component('reset-app-pool', {
    template: `<div>
                    <div class="row">
                        <input type='text' placeholder='Username' v-model='user' />
                        <input type='password' placeholder='Password' v-model='pass' />
                    </div>
                    <div @click='refreshCache()' class="row link">Update Cache</div>
                    <div class="row">
                    <input type='text' v-model='search' placeholder="Search by Site:" />
                    </div>
                    <div class="row webFarm" v-for="(group,index) in filteredList" :key="group.farm" >
                        <div class="row accordianHead" @click="toggleAccordion(index)">
                            {{group.farm}}
                        </div>
                        <div class="row">
                            <span class="subNote" v-for="(server,index) in group.servers">{{server}}<span v-if="index !== group.servers.length - 1">, </span></span>
                        </div>
                        <div class="row accordianBody" v-show="visibleItemIndex == index">
                            <div class="u-full-width">

                            </div>
                            <div>
                                <div class="pool" v-for="pool in group.appPools">
                                    <div class="row">
                                        <div class="five columns">
                                           <b>Site Name:</b> {{pool.SiteName}}{{pool.Path}}
                                        </div>
                                        <div class="five columns">
                                            <b>App Pool:</b> <span>{{pool.ApplicationPool}}</span>
                                        </div>
                                        <div class="two columns">
                                            <span class="Stop" title="Stop" @click="stop(pool.ApplicationPool,group.servers)"></span>
                                            <span class="Start" title="Start" @click="start(pool.ApplicationPool,group.servers)"></span>
                                            <span class="Recycle" title="Recycle" @click="recycle(pool.ApplicationPool,group.servers)"></span>
                                            <span class="Recycle" title="Refresh Status" @click="refresh(pool.ApplicationPool,group.servers)"></span>
                                        </div>
                                    </div>
                                    <div class="row">
                                            <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    data: function () {
        return {
            webFarm: [{}],
            search: "",
            user: "",
            pass: "",
            visibleItemIndex: -1
        }
    },
    computed: {
        filteredList: function () {
            var result = cloneDeep(this.webFarm);
            if (this.search) {
                let sv = this.search.toLowerCase()
                result = result.filter(e => {
                    if (e.appPools.some(a => {
                        if (a.SiteName.toLowerCase().includes(sv)) return true
                        if (a.Path.toLowerCase().includes(sv)) return true
                    })) return true
                })
                result.forEach(e => {
                    e.appPools = e.appPools.filter(a => {
                        if (a.SiteName.toLowerCase().includes(sv)) return true
                        if (a.Path.toLowerCase().includes(sv)) return true
                    })
                });
            }
            return result
        }
    },
    created: function () {
        var dc = require("./dataLayer");
        dc.getAll(e => {
            this.webFarm = e;
        });
    },
    methods: {
        getAppPools: function (webFarm) {


        },
        refreshCache: function () {
            var dc = require("./dataLayer");
            dc.updateCache(this.user, this.pass);
            dc.getAll(e => {
                this.webFarm = e;
            });
        },
        toggleAccordion(index){
            if(this.visibleItemIndex == index){
                this.visibleItemIndex = -1;
            }else{
                this.visibleItemIndex = index;
            }
        },
        stop(pool){

        },
        start(pool){

        },
        recycle(pool,servers){
            var ps = require("./powershellAccess")
            ps.recycleAppPool(pool,servers,this.user,this.pass,e =>{
                alert("Recycled " + e)
            })
        }
    }
})