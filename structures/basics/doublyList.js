import DLLNode from "structures/basics/dllNode";
class DoublyLinkedList {
    constructor() {
        // add a node in the end
        this.push = (val) => {
            let node = new DLLNode(val);
            if (!this.head) {
                this.head = node;
                this.tail = node;
            }
            else {
                node.prev = this.tail;
                this.tail.next = node;
                this.tail = node;
            }
            this.length++;
            return this;
        };
        // remove the last node and return it
        this.pop = () => {
            // return undefined if this is an empty list
            if (!this.head)
                return;
            let removed = this.tail;
            if (this.length === 1) {
                this.tail = null;
                this.head = null;
            }
            else {
                this.tail = removed.prev;
                this.tail.next = null;
            }
            removed.prev = null;
            this.length--;
            return removed;
        };
        // remove the first node and return it
        this.shift = () => {
            if (!this.head)
                return;
            let removed = this.head;
            if (this.length === 1) {
                this.head = null;
                this.tail = null;
            }
            else {
                this.head = removed.next;
                this.head.prev = null;
            }
            removed.next = null;
            this.length--;
            return removed;
        };
        // add a node in the beginning
        this.unshift = (val) => {
            let node = new DLLNode(val);
            if (!this.head) {
                this.head = node;
                this.tail = node;
            }
            else {
                node.next = this.head;
                this.head.prev = node;
                this.head = node;
            }
            this.length++;
            return this;
        };
        // return the kth node
        this.get = (k) => {
            // negative index or empty list or k out of range
            if (k < 0 || this.length === 0 || k >= this.length)
                return null;
            let node;
            // check if k is in the first half
            if (k <= Math.floor(this.length / 2)) {
                let count = 0;
                node = this.head;
                while (count < k) {
                    node = node.next;
                    count++;
                }
                // if k is in the 2nd half
            }
            else {
                let count = this.length - 1;
                node = this.tail;
                while (count > k) {
                    node = node.prev;
                    count--;
                }
            }
            return node;
        };
        //  set the kth node with val and return true
        this.set = (k, val) => {
            let node = this.get(k);
            // if this k is invalid return false
            if (!node)
                return false;
            node.val = val;
            return true;
        };
        // insert a new node in the kth position
        this.insert = (k, val) => {
            if (k < 0 || k > this.length)
                return false;
            if (k === 0) {
                this.unshift(val);
                return true;
            }
            if (k === this.length) {
                this.push(val);
                return true;
            }
            let prev = this.get(k - 1);
            let next = prev.next;
            let node = new DLLNode(val);
            node.prev = prev;
            prev.next = node;
            node.next = next;
            next.prev = node;
            this.length++;
            return true;
        };
        // remove the kth node of the list
        this.remove = (k) => {
            if (k < 0 || k >= this.length)
                return;
            if (k === 0)
                return this.shift();
            if (k === this.length - 1)
                return this.pop();
            let prev = this.get(k - 1);
            let removed = prev.next;
            let next = removed.next;
            removed.prev = null;
            removed.next = null;
            prev.next = next;
            next.prev = prev;
            this.length--;
            return removed;
        };
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}
export default DoublyLinkedList;
