const fs = require('fs');
const todo = require('./todo');
const mac = require('macaddress');
var functions = {};

functions.store = (data) => {
    //JSON.parse(fs.readFileSync(mac.replace(/:/g, '-') +'.json'))
    mac.one(function (err, mac) {
        if(fs.existsSync(mac.replace(/:/g, '-') +'.json')) fs.unlinkSync(mac.replace(/:/g, '-') +'.json');
            data.completed = 0;
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
            if(data == undefined) callback(undefined)
            callback(data)
        }); 
        // callback(data);
    });
}


functions.storeValues = () => {
    mac.one(function (err, mac) {
        if(fs.existsSync(mac.replace(/:/g, '-') +'.json')) {

            fs.readFile(mac.replace(/:/g, '-') +'.json', (err, data) => {
                todo.createTodo(data, (err, response) =>  {
                    if(  err ) res.send(err).status(400);
                });
            }); 

            fs.unlinkSync(mac.replace(/:/g, '-') +'.json');
        }
    })
};

module.exports = functions;