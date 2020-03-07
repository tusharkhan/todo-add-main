const fs = require('fs');
const path = require('path');
const public_path = path.join(__dirname, './viwes');
const mac = require('macaddress');
var functions = {};

functions.store = (data) => {
    data.completed = 0;
    mac.one(function (err, mac) {
        let datas = [];
        datas[0] = JSON.stringify(data);
        fs.appendFileSync(mac.replace(/:/g, '-') +'.json' , datas, (err) => {
            if(err) throw err;
        }); 
    });
};

functions.read = (callback) => {
    mac.one(function (err, mac) {
        console.log(mac.replace(':', '-'));
        fs.readFile(mac.replace(/:/g, '-') +'.json', (err, data) => {
            callback(data)
        }); 
        // callback(data);
    });
}

module.exports = functions;