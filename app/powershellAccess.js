let shell = require('node-powershell');


exports.getCredential = function (user, pass) {
    if(!user || !pass){
        return "";
    }
    return `$password = ConvertTo-SecureString ${pass} -AsPlainText -Force; $Cred = New-Object System.Management.Automation.PSCredential ("${user}", $password)`
}
exports.getAppPoolByFarm = function (webFarm,user,pass) {
    if(!this.getCredential(user,pass)){
        return;
    }
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true });
    ps.addCommand(this.getCredential(user,pass));
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
exports.stopAppPool = function(){
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true });

}