class Queue<T> {
    private queue : Array<T>;

    public constructor() {
        this.clear();
    }

    public dequeue() : T {
        if (this.length <= 0) {
            throw new Error("Queue empty")
        }

        var value = this.queue.shift();
        this.length = this.queue.length;
        return value;
    }

    public enqueue(value : T) : void {
        this.length = this.queue.push(value);
    }

    public clear() : void {
        this.queue = new Array<T>();
        this.length = 0;
    }

    public length : number;
}

export = Queue