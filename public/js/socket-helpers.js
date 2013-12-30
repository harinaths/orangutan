/**
 * Created with JetBrains WebStorm.
 * User: harinaths
 * Date: 30/12/13
 * Time: 12:30 AM
 * To change this template use File | Settings | File Templates.
 */

/* On Document Ready*/

/*
    1) get Port list via socket
*/



$(document).ready(function(){

    io = io.connect();
    io.emit('ready')
    initializeSocketHandlers();
    initialProcess();
});



/* Socket Handlers */

var initializeSocketHandlers = function(){
    io.on('talk', function (data) {
        console.log(data.message);
    });

    io.on('ports', function(ports){
         console.log("Ports Received", ports);

        _.each(ports, function(port){
              console.log(port);
            $('#port').append('<option value="'+port+'">'+port+'</option>')
        });

    });

    io.on('message', function (data) {

        console.log("Hex Message Cheched", $(".hexMessage").is(':checked'))
        console.log("Ascii Message Cheched", $(".asciiMessage").is(':checked'))

        if($(".hexMessage").is(':checked')) {

            var hexSplitMessage = data.hex.match(/.{1,100}/g);
            var hexStr  = S(hexSplitMessage.join()).replaceAll(',',' ');
            $('#console').append('<span class="spanclass" style="color: white">HEX : '+hexStr+'</span><br>');
        }

        if($(".asciiMessage").is(':checked')) {

            var asciiMessage =  S(data.ascii).replaceAll('\n','<br>')
            console.log(asciiMessage)
            $('#console').append('<span class="spanclass" style="color: #ffff00">'+asciiMessage+'</span>');
        }

        $('#console').append('<hr>');
        var elem = document.getElementById('consolediv');
        elem.scrollTop = elem.scrollHeight;


//        $('#console').append('<p>'+data.message+'</p>');

//        console.log(S(data.message).isEmpty())
//        console.log(data.message);
    });

    io.on('error', function (err) {
        console.log(err);
    });

    io.on('close', function (close) {
        console.log(close);
    });
};


var initialProcess = function(){
    io.emit('ports')
};


var connectDevice = function(){

    var properties = {
        port : $('#port').val(),
        options : {
            baudrate : $('#baudrate').val()*1,
            databits : $('#databits').val()*1,
            stopbits : $('#stopbits').val()*1,
            parity : $('#parity').val(),
            buffersize : $('#buffersize').val()*1  || 255
        }
    }
    console.log(properties)

    io.emit('connectDevice', properties);
}


var deviceDisconnect = function(){
     console.log("Device Disconnect Triggered");
}


var sendCommand = function(){

    var cr=   ($(".hexMessage").is(':checked') && '\r');
    var lf =   ($(".hexMessage").is(':checked') && '\n');

    var properties = {
        port : $('#port').val(),
        command : $('.cmdMsg').val()
    }

    io.emit('command', properties);
};

