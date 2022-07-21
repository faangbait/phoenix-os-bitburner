import Node from "structures/basics/node";
// Queue implementation, FIFO, through linked list
class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    // add to the end and return the size of this queue
    enQueue(key) {
        let node = new Node(key);
        if (this.size === 0) {
            this.first = node;
            this.last = node;
        }
        else {
            this.last.next = node;
            this.last = node;
        }
        this.size++;
        return this.size;
    }
    // remove the first node and return it
    deQueue() {
        if (this.size === 0)
            return null;
        let removed = this.first;
        if (this.size === 1) {
            this.first = null;
            this.last = null;
        }
        else {
            this.first = removed.next;
            removed.next = null;
        }
        this.size--;
        return removed;
    }
}
export default Queue;
