var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true, useUnifiedTopology: true});

// create a schema - this is like a blueprint
var todoSchema = mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);


// var data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}];
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function(app){

app.get('/todo', function(req, res){
    // get data from mongodb and pass it to the view

    Todo.find({}, function(err, data){
        if(err) throw err;

        res.render('todo', {todos: data});
    });
});

app.post('/todo', urlencodedParser, function(req, res){
    // get data from the view and add it to mongodb
    var newTodo = Todo(req.body).save(function(err, data){
        if(err) throw err;

        res.json(data);
    });
});

app.delete('/todo/:item', function(req, res){
    // delete the requested item from mongodb
    console.log(req.params.item);
    Todo.deleteOne({item: req.params.item.replace(/\-/g, " ")}, function(err, data){
        if(err) throw err;
        res.json(data);
    });
});

};