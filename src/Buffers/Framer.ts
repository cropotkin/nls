import Queue = require("./Queue");

class Framer {
    
    private wordCount : number;

    private callback : (frame : Uint32Array) => void;

    private length : number;

    private queue : Queue<Buffer>;

    private partialBuffer : Buffer;
    private partialConsumed : number;

    public constructor(wordCount : number, callback : (frame : Uint32Array) => void) {
        this.wordCount = wordCount;
        this.callback = callback;
        this.length = 0;
        this.queue = new Queue<Buffer>();
        this.partialBuffer = new Buffer(0);
        this.partialConsumed = 0;
    }

    public write(buffer : Buffer) : void {
        if (buffer.byteLength == 0) {
            return;
        }
        
        this.queue.enqueue(buffer);

        this.length += buffer.byteLength;

        if (this.length >= this.wordCount * 4)
        {
            var frame = new Uint32Array(this.wordCount);

            for (var i = 0; i < this.wordCount; i++) {
                var word = this.collectWord();
                frame[i] = word;
                this.length -= 4;
            }

            this.callback(frame);
        }
    }

    private collectWord() : number {
        var value1 = this.collectByte();
        var value2 = this.collectByte();
        var value3 = this.collectByte();
        var value4 = this.collectByte();
        return value1 << 24 | value2 << 16 | value3 << 8 | value4;
    }

    private collectByte() : number {
        if (this.partialBuffer.byteLength == this.partialConsumed)
        {
            this.partialBuffer = this.queue.dequeue();
            this.partialConsumed = 0;
        }

        return this.partialBuffer.readUInt8(this.partialConsumed++);
    }
}

export = Framer