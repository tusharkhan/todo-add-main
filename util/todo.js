const request = require('request');
const url = 'http://localhost:8000/api/todo';
const funcs = {};

funcs.getTodos = (callback) => {
    request({ url: url, json: true }, (err, res) =>{
        if ( err ) {
            callback('Internal server error', undefined);
        } else {
            callback(undefined, res.body);
        }
    });
}


funcs.updateTodo = (data, callback) => {
    request.put({ url: url + '/' + data.id, json: true, form:data },  function(err, httpResponse,body) {
        if ( err ) {
            callback(err, undefined);
        } else {
            callback(undefined, body);
        }
    });
}


funcs.createTodo = (data, callback) => {
    request.post({url:url, form: data}, function(err,httpResponse,body){ 
            if(err) callback(err, undefined);
            else callback(undefined, body)
    });
};

module.exports = funcs;