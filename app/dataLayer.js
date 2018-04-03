var nosql = require('nosql');
var db = nosql.load('database.nosql');

exports.getCredential = function (user, pass) {
    if(!user || !pass){
        return "";
    }
    return `$password = ConvertTo-SecureString ${pass} -AsPlainText -Force; $Cred = New-Object System.Management.Automation.PSCredential ("${user}", $password)`
}
exports.getAll = function (fn) {
    db.find().make(function (b) {
        b.callback(function (err, resp) {
            fn(resp);
        })
    })
};
exports.clearCache = function (fn) {
    db.remove().make(function (b) {
        b.callback(function (err, resp) {
            fn(resp);
        });
    });
}
exports.updateCache = function (user,pass) {
    this.clearCache(function (resp) {
        webFarms.forEach(e => {
            module.exports.getAppPoolByFarm(e,user,pass);
            db.insert(e);
        });
    });
};
exports.getAppPoolByFarm = function (webFarm,user,pass) {
    if(!this.getCredential(user,pass)){
        return;
    }
    let shell = require('node-powershell');
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true });
    ps.addCommand(this.getCredential());
    ps.addCommand('$server = ' + webFarm.servers.join(", "));
    ps.addCommand('$pools = Get-WmiObject -namespace "root\\webadministration" -Class Application -ComputerName $server -Credential $Cred');
    ps.addCommand("$pools | Select SiteName, ApplicationPool, Path |convertto-json")
    ps.invoke()
        .then(output => {
            webFarm.appPools = (JSON.parse(output))

        })
        .catch(err => {
            console.log(err)
            ps.dispose();
        });
}

