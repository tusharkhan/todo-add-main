const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

var __session = null;
const ifnotlogin = require('./util/ifNotLogIn');
const public_path = path.join(__dirname, './viwes');
const todo = require('./util/todo');
const auth = require('./util/auth');
const bodyParser = require('body-parser');
const port  = process.env.PORT || 3030;

app.use(session({secret: 'todo_list_app'}));

app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/viwes')));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }))

var Handlebars = require('hbs');

Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

app.listen(port, () => {
    console.log('Server running in port : ', port);
});

app.get('/', (req, res) => {
    if(! __session){
        ifnotlogin.read((data) => {
            console.log(data == undefined)
            if(data === undefined) res.render(public_path + '/index');
            else res.render(public_path + '/index', {fileresults: JSON.parse(data)});
        });
    } else {
        ifnotlogin.storeValues();
        todo.getTodos((err, result) => {
            res.render(public_path + '/index', {results: result.todos});
        });
    }
});



app.get('/update/:id/:completed', (req, res) => {
    console.log(req.params)
    var data ;

    if( req.params.completed  == 'true') {
        data = {
            id: req.params.id,
            completed: 1
        }
    } else {
        data = {
            id: req.params.id,
            completed: 0
        }
    }
    todo.updateTodo(data, (err, result) => {
        if( err ) res.send(err).status(400);
        res.redirect('/');
    });
});


app.post('/create', (req, res) => {
    // console.log(req.session)
    if( ! __session ){
        ifnotlogin.store(req.body);
        res.redirect('/');
    } else {
        todo.createTodo(req.body, (err, response) =>  {
            if( ! err ) res.redirect('/');
            res.send(err).status(400);
        });
    }
});


app.get('/register', (req, res) => {
    res.render(public_path + '/register');
});


app.post('/register', (req, res) => {
    auth.register(req.body, (error, data) => {
        if( error ) res.send(error).status(400);
        else {
            __session = req.session;
            __session.token = data.body.access_token;
            res.redirect('/');
        }
    });
});

app.get('/login', (req, res) => {
    res.render(public_path + '/login');
});

app.post('/login', (req, res) => {

    auth.login(req.body, (error, data) => {
        if( error ) res.send(error).status(404);
        else {
            __session = req.session;
            __session.token = data.body.access_token;
            res.redirect('/');
        }
    });
});


app.get('/user', (req, res) => {
    auth.getCurrentUser(req.session.token, (error, result) => {
        if( error ) res.send(error).status(400);
        res.send(result).status(200);
    });
});


app.post('/logout', (req, res) => {
    auth.logout(req.session.token, (error, result) => {
        if( error ) res.send(error).status(400);
        req.session.destroy(function(err) {})
        res.send(result).status(200);
    });
});


app.get('/delete/:id', (req, res) => {
    console.log(req.params)
    todo.delete(req.params, (error, result) => {
        if( error ) res.send(err).status(400);
        res.redirect('/');
        // res.send(result).status(200);
    })
});