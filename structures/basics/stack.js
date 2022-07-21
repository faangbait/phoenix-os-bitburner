import Node from "structures/basics/node";
// simple implementation using SLL, shift and unshift, here called as push and pop
// First in Last Out
class Stack {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }
    // add a node at the beginning and return the size of this stack
    push(key) {
        let node = new Node(key);
        if (this.size === 0) {
            this.first = node;
            this.last = node;
        }
        else {
            node.next = this.first;
            this.first = node;
        }
        this.size++;
        return this.size;
    }
    // remove the first node and return it
    pop() {
        // empty stack
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
export default Stack;
