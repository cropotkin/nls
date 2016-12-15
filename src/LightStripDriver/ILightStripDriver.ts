
import ILightStripInfo = require("./ILightStripInfo");

interface ILightStripDriver {
    info : ILightStripInfo;
    render(lights : Uint32Array) : void;
    setBrightness(value : number) : void; 
    close() : void;
}

export = ILightStripDriver