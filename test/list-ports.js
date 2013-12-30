/**
 * Created with JetBrains WebStorm.
 * User: harinaths
 * Date: 28/12/13
 * Time: 5:21 PM
 * To change this template use File | Settings | File Templates.
 */


var serialport = require("serialport");

serialport.list(function (err, ports) {

    ports.forEach(function(port) {

      console.log("Com Port Name : ", port.comName, " | pnpId : ", port.pnpId, " | Manufacturer : ", port.manufacturer || " - ");

    });

});