var codein = require('node-codein');
var SerialPort = require("serialport").SerialPort
serialPort = new SerialPort("/dev/ttyUSB0", {
    baudrate: 115200,
    databits : 8,
    stopbits : 1,
    parity : 'none'
})


serialPort.on('open', function(){
    console.log(' Opened ');
    serialPort.on('data',function(data){
        console.log('data in Hex : ' , data.toString('hex'));
        console.log('data in Ascii : ' , data.toString('ascii'));
    })
    serialPort.write("at+ionip?\r\n", function(err, results) {
        console.log('err ' + err);
        console.log('results ' + results);
    });
});

serialPort.on('error', function(){
    console.log('Error');
});

serialPort.on('close', function(){
    console.log('Closed');
});

//serialPort.on('', function(){
//    console.log('');
//});
//
//serialPort.on('', function(){
//    console.log('');
//});