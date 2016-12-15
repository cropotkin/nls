import ILightStripInfo = require("./ILightStripInfo");

class LightStripInfo implements ILightStripInfo {

    public constructor(name : string, count : number, framesPerSecond : number) {
        this.name = name;
        this.count = count;
        this.framesPerSecond = framesPerSecond;
    }

    public name : string;
    
    public count : number;
    
    public framesPerSecond : number;
}

export = LightStripInfo