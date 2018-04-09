let shell = require('node-powershell');


exports.getCredential = function (user, pass) {
    if (!user || !pass) {
        return "";
    }
    return `$password = ConvertTo-SecureString ${pass} -AsPlainText -Force; $Cred = New-Object System.Management.Automation.PSCredential ("${user}", $password)`
}
exports.getAppPoolByFarm = function (webFarm, user, pass) {
    if (!this.getCredential(user, pass)) {
        return;
    }
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true, debugMsg: false });
    ps.addCommand(this.getCredential(user, pass));
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
exports.stopAppPool = function () {
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true, debugMsg: false });
    ps.addCommand(this.getCredential(username, pass))
    ps.addCommand(`$apppool = '${pool}'`);
    ps.addCommand(`Invoke-Command -Credential $Cred -ComputerName ${servers.join(",")} -ScriptBlock {Import-Module WebAdministration; Stop-WebAppPool $Using:apppool}`)
    ps.addCommand(`"$apppool was stopped"`)
    ps.invoke()
        .then(output => {
            fn(output)
        })
        .catch(e => {
            console.log(e);
            ps.dispose();
        });
}

exports.recycleAppPool = function (pool, servers, username, pass, fn) {
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true, debugMsg: false });
    this.getAppPoolStatus(pool, servers, username, pass, e => {
        if (e.trim() == 'Started') {
            ps.addCommand(this.getCredential(username, pass))
            ps.addCommand(`$apppool = '${pool}'`);
            ps.addCommand(`Invoke-Command -Credential $Cred -ComputerName ${servers.join(",")} -ScriptBlock {Import-Module WebAdministration; Restart-WebAppPool $Using:apppool}`)
            ps.addCommand(`"$apppool was recycled"`);
            ps.invoke()
                .then(output => {
                    fn(output)
                })
                .catch(err => {
                    console.log(err);
                    ps.dispose();
                })
            //Invoke-Command -ComputerName $svr -ScriptBlock {Import-Module WebAdministration; Restart-WebAppPool $Using:apppool}
        }
        else {
            this.startAppPool(pool, servers, fn)
        }
    })
}
exports.startAppPool = function (pool, servers, fn) {
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true, debugMsg: false });
    ps.addCommand(this.getCredential(username, pass))
    ps.addCommand(`$apppool = '${pool}'`);
    ps.addCommand(`Invoke-Command -Credential $Cred -ComputerName ${servers.join(",")} -ScriptBlock {Import-Module WebAdministration; Start-WebAppPool $Using:apppool}`)
    ps.addCommand(`"$apppool was started"`)
    ps.invoke()
        .then(output => {
            fn(output)
        })
        .catch(e => {
            console.log(e);
            ps.dispose();
        });
}
exports.getAppPoolStatus = function (pool, servers, username, pass, fn) {
    let ps = new shell({ executionPolicy: 'Bypass', noProfile: true, debugMsg: false });
    ps.addCommand(this.getCredential(username, pass));
    ps.addCommand(`$apppool = '${pool}'`)
    ps.addCommand(`Invoke-Command -Credential $Cred -ComputerName ${servers.join(",")} -ScriptBlock {Import-Module WebAdministration; (Get-WebApppoolState $Using:apppool).Value}`)
    ps.invoke()
        .then(o => {
            fn(o)
        })
        .catch(e => {
            console.log(e);
            ps.dispose();
        })
    // $AppPoolStatus = Invoke-Command -ComputerName $svr -ScriptBlock {Import-Module WebAdministration; (Get-WebApppoolState $Using:apppool).Value
}