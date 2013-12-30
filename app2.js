/**
 * Created with JetBrains WebStorm.
 * User: harinaths
 * Date: 28/12/13
 * Time: 10:39 PM
 * To change this template use File | Settings | File Templates.
 */



var express = require('express.io'),
 routes = require('./routes')
    , http = require('http')
    , path = require('path')
app = express();
app.http().io()


app.use(express.logger('dev'));
// Setup the ready route, and emit talk event.

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());

app.io.route('ready', function(req) {
    req.io.emit('talk', {
        message: 'io event from an io route on the server'
    })
})

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// Send the client html.
app.get('/', function(req, res) {
    res.sendfile("/home/harinaths/Desktop/orangutan/views/test.html");
})

if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.listen(3030)