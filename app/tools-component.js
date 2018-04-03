Vue.component('tools',{
    template:'<div><div class="icon" v-for="tool in tools" @click="openTool(tool)"><div>{{tool.Title}}</div></div></div>',
    data:function(){
        var fs = require('fs');

        var jsonPath = 'tools.json'
        return {
         tools: toolsList
        }
    },
    methods:{
        openTool:function(tool){
            let proc = require('child_process').spawn;
            proc(tool.Path);
        }
    }
})