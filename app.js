
/**
 * Module dependencies.
 */


var portsObject = {

};
var S = require('string');
var express = require('express.io')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
var serialport = require("serialport");
var SerialPort =  serialport.SerialPort
var _ = require('underscore');


var app = express();

app.use(express.logger('dev'));
app.http().io();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser())
app.use(express.session({secret: 'monkey'}))
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});


app.get('/sendMessage', function(req, res){
    console.log(req.query);
    console.log("Got SendMessage Action");
    res.send("Received")
});



app.listen(app.get('port'));



app.io.route('ready', function(req) {
    req.io.emit('talk', {
        message: 'io event from an io route on the server'
    })
})



app.io.route('hello', function(req) {
    console.log("In Hello");
})


app.io.route('joinRoom', function(req){
    console.log("On Join Room...");
      console.log(req.data);
    req.io.join(req.data)
});


app.io.route('sendMessageToRoom', function(req){
    console.log(req.data);
    app.io.room(req.data.room).broadcast('roomMessage',req.data.message)
});

app.io.route('sendMessageToSession', function(req){
    console.log(req.data);
    app.io.sockets.in(req.data.sessionId).emit("message",req.data.message);

});



app.io.route('ports', function(req){
    console.log("In getting ports list")
    serialport.list(function (err, ports) {

        if(!err){
            req.io.emit('ports',_.pluck(ports,'comName'));
        }

    });
})


app.io.route('connectDevice', function(req){
    console.log(req.data);

    var sp = new SerialPort(req.data.port, req.data.options);
    portsObject[req.data.port] = sp;

    sp.on('open', function(){

        sp.on('data',function(data){

            console.log('HEX FORMAT : ', data.toString('hex'));
            console.log("ASCII FORMAT : ", data.toString('ascii'));
            console.log('---------------------------------------------------------------------------------------------');
            req.io.emit('message', {ascii : data.toString('ascii'), hex : data.toString('hex')  }) ;

        });
//        sp.write("at+ionip?\r\n", function(err, results) {
//            console.log('err ' + err);
//            console.log('results ' + results);
//        });
    });

    sp.on('error', function(){
        console.log('Error');
        req.io.emit('error', {port : req.data.port}) ;
    });

    sp.on('close', function(){
        req.io.emit('close', {port : req.data.port}) ;
        console.log('Closed');
    });


});

app.io.route('command', function(req){
    var sp = portsObject[req.data.port];
    console.log(req.data);
    sp.write(req.data.command+'\r\n', function(err, results) {
       console.log('err ' + err);
       console.log('results ' + results);
     });
})


ioObj = app.io;