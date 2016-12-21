/// <reference path="../node_modules/@types/node/index.d.ts"/>

import Net = require("net");

import ILightStripDriver = require('./LightStripDriver/ILightStripDriver');
import LightStripDriverWs281x = require('./LightStripDriver/LightStripDriverWs281x');
import LightStripDriverTest = require('./LightStripDriver/LightStripDriverTest');

import Framer = require('./Buffers/Framer');
import PromiseQueue = require('./Buffers/PromiseQueue');

var driver : ILightStripDriver = new LightStripDriverWs281x(300);

driver.setBrightness(20);

// var driver : ILightStripDriver = new LightStripDriverTest(20);

var frameQueue = new PromiseQueue<Uint32Array>(); 

var server = Net.createServer(function(socket) {
	socket.write(JSON.stringify(driver.info) + '\n');

    var framer = new Framer(driver.info.count, frame =>
    {
        frameQueue.write(frame);
    });

    socket.on('data', buffer => {
        framer.write(buffer);
    });
});

function fill() {
    frameQueue.read().then(v =>
    {
        driver.render(v);
        fill();
    });
}

function close() {
    console.log("closing...");
    server.close();
    driver.close();
    console.log("closed");
    process.exit();
}

server.listen(2512, '0.0.0.0');

console.log("listening on port 2512");

process.on('SIGINT', () => {
    close();
});

process.stdin.addListener("data", () => {
    close();
});

fill();


