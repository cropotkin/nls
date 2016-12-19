var ws281x = require('rpi-ws281x-native');

import LightStripInfo = require("./LightStripInfo");

import ILightStripInfo = require("./ILightStripInfo");

import ILightStripDriver = require("./ILightStripDriver");

class LightStripDriverWs281x implements ILightStripDriver {
    constructor(count : number) {
        this.info = new LightStripInfo("ws281x", count, 100);
        ws281x.init(count);
    }

    public info : ILightStripInfo;

    public render(lights : Uint32Array) : void {
        ws281x.render(lights);
    }
    
    public setBrightness(value : number) : void {
        ws281x.setBrightness(value);
    } 

    public close() : void {
        ws281x.reset();
    }
}

export = LightStripDriverWs281x