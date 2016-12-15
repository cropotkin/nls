import Queue = require("./Queue");

class PromiseQueue<T> {
    private closed : boolean;
    private resolveQueue : Queue<(value? : T | PromiseLike<T>) => void>;
    private rejectQueue : Queue<(reason? : any) => void>;
    private valueQueue : Queue<T>;

    constructor() {
        this.closed = false;
        this.resolveQueue  = new Queue<(value? : T | PromiseLike<T>) => void>();
        this.rejectQueue  = new Queue<(reason? : any) => void>();
        this.valueQueue = new Queue<T>();
    }

    public read() : Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (this.closed) {
                reject();
            }
            else if (this.valueQueue.length > 0) {
                resolve(this.valueQueue.dequeue());
            }
            else {
                this.resolveQueue.enqueue(resolve);
                this.rejectQueue.enqueue(reject);
            }
        });
    }

    public write(value : T) : void {
        if (this.closed) {
            return;
        }

        if (this.resolveQueue.length > 0) {
            this.resolveQueue.dequeue()(value);
            this.rejectQueue.dequeue();
        }
        else {
            this.valueQueue.enqueue(value);
        }
    }

    public close() {
        this.closed = true;

        this.valueQueue.clear();
        this.resolveQueue.clear();

        while (this.rejectQueue.length > 0) {
            this.rejectQueue.dequeue()();
        }
    }
}

export = PromiseQueue