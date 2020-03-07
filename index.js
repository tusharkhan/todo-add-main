const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
var __session = null;
const public_path = path.join(__dirname, './viwes');
const todo = require('./util/todo');
const auth = require('./util/auth');
const bodyParser = require('body-parser');
const port  = process.env.PORT || 3030;

app.use(session({secret: 'todo_list_app'}));

app.use(express.static(public_path));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(port, () => {
    console.log('Server running in port : ', port);
});

app.get('/', (req, res) => {
    console.log(public_path)
    todo.getTodos((err, result) => {
        res.send(result);
    });
});


app.get('/update/:id', (req, res) => {
    let data = {
        id: 14,
        name: "test todo",
        completed: false
    }
    todo.updateTodo(data, (err, result) => {
        if( err ) res.send(err).status(400);
        res.send(result).status(200);
    });
});


app.get('/create', (req, res) => {

    todo.createTodo({name: "two"}, (err, response) =>  {
        if( ! err ) res.send(response).status(200);
        res.send(err).status(400);
    });
});


app.get('/register', (req, res) => {
    res.render(public_path + '/register');
});


app.post('/register', (req, res) => {
    auth.register(req.body, (error, data) => {
        if( error ) res.send(error).status(400);
        res.send(data).status(200);
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
            res.send(data).status(200);
        }
    });
});


app.get('/user', (req, res) => {
    auth.getCurrentUser(req.session.token, (error, result) => {
        if( error ) res.send(error).status(400);
        res.send(result).status(200);
    });
});


app.get('/logout', (req, res) => {
    auth.logout(req.session.token, (error, result) => {
        if( error ) res.send(error).status(400);
        req.session.destroy(function(err) {})
        res.send(result).status(200);
    });
});