
Vue.component('reset-app-pool', {
    template: `<div>
                    <input type='text' v-model='search' />
                    <div class="webFarm" v-for="group in filteredList" :key="group.farm" >
                        <div>{{group.farm}}</div>
                        <div class="link" @click="getAppPools(group)">Get pools</div>
                        <div class="accordianBody">
                            <span class="subNote" v-for="(server,index) in group.servers">{{server}}<span v-if="index !== group.servers.length - 1">, </span></span>
                            <div>
                                <div class="pool" v-for="pool in group.appPools"><span>{{pool.SiteName}}</span>/<span>{{pool.ApplicationPool}}</span><span class="Stop"></span><span class="Start"></span><span class="Recycle"></span><br><span class="subNote">{{pool.Path}}</span></div>
                            </div>
                        </div>
                    </div>
                </div>`,
    data: function () {
        return {
            webFarm: [{}],
            search:""
        }
    },
    computed:{
        filteredList:function(){
          return this.webFarm
        }

    },
    created:function(){
        var dc = require("./dataLayer");
        dc.updateCache();
        dc.getAll(e =>{
            this.webFarm = e;
        });
    },
    methods: {
        getAppPools: function (webFarm) {


        },

    }
})