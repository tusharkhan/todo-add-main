const request = require('request');
const url = 'http://localhost:8000/api/todo';
const funcs = {};

funcs.getTodos = (callback) => {
    request.get({ url: url, json: true, headers: {
        'Content-Type' : 'application/json'
    } }, (err, httpResponse,body) =>{
        if ( err ) {
            callback(err, undefined);
        } else {
            callback(undefined, body);
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

funcs.delete = (data, callback) => {
    request.delete({url:url+ '/' + data.id, form: data}, function(err,httpResponse,body){ 
        if(err) callback(err, undefined);
        else callback(undefined, body)
    });
};

module.exports = funcs;