const request = require('request');
const axios = require('axios').default;
const functions = {};

functions.register = (data, callback) => {
    let url = "http://localhost:8000/api/register";

    request.post({
        url: url, 
        json: true,
        form: data  
    }, (error, response) => {
        if( error ) callback(error, undefined);
        callback(undefined, response);
    });
}


functions.login = (data, callback) => {
    let url = "http://localhost:8000/api/login";

    request.post({
        url: url, 
        json: true,
        form: data  
    }, (error, response) => {
        if( error ) callback(error, undefined);
        callback(undefined, response);
    });
}

functions.getCurrentUser = (data, callback) => {
    let url = "http://localhost:8000/api/user";

    request.get({url:url, json:true, headers: {
        'Authorization' : 'bearer ' + data
    }}, (error, response, body) =>{
        if( error ) callback(error, undefined);
        callback(undefined, body);
    });
}


functions.logout = (data, callback) => {
    let url = "http://localhost:8000/api/logout";

    request.post({url:url, json:true, headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'bearer ' + data
    }}, (error, response, body) =>{
        if( error ) callback(error, undefined);
        callback(undefined, body);
    });
}

module.exports = functions;