var nosql = require('nosql');
var db = nosql.load('database.nosql');


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
    var ps = require("./powershellAccess")
    this.clearCache(function (resp) {
        webFarms.forEach(e => {
            ps.getAppPoolByFarm(e,user,pass);
            db.insert(e);
        });
    });
};


