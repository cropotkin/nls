import File = require('fs');

import LightStripInfo = require("./LightStripInfo");

import ILightStripInfo = require("./ILightStripInfo");

import ILightStripDriver = require("./ILightStripDriver");

class LightStripDriverTest implements ILightStripDriver {
    
    file : File.WriteStream;

    constructor(count : number) {
        this.info = new LightStripInfo("test", count, 100);
        this.file = File.createWriteStream("./lightstrip.txt")
    }

    public info : ILightStripInfo;

    public render(lights : Uint32Array) : void {
        var first = true;
        lights.forEach((v, i, a) => {
            if (!first) {
                this.file.write(' ');
            }
            first = false;
            this.file.write("#" + v.toString(16));
        });
        this.file.write('\n');
    }
    
    public setBrightness(value : number) : void {
        this.file.write("SET BRIGHTNESS " + value + "\n");
    } 

    public close() : void {
        this.file.close();
    }
}

export = LightStripDriverTest