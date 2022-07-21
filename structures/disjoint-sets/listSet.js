import LinkedList from "structures/basics/linkedList";
import LLNode from "structures/basics/llNode";
class ListSet {
    constructor() {
        this.makeSet = (x) => {
            const list = new LinkedList();
            const node = list.push(x);
            this.lists.set(x, list);
            this.pointers.set(x, node);
        };
        this.findSet = (x) => {
            if (!this.pointers.get(x))
                return null;
            const node = this.pointers.get(x);
            const l = node.list;
            return l.head;
        };
        this.union = (x, y) => {
            if (!(x instanceof LLNode) && !this.pointers.get(x))
                return null;
            if (!(y instanceof LLNode) && !this.pointers.get(y))
                return null;
            const xNode = x instanceof LLNode ? x : this.pointers.get(x);
            const yNode = y instanceof LLNode ? y : this.pointers.get(y);
            const sx = xNode.list;
            const xLeader = sx.head;
            const sy = yNode.list;
            const yLeader = sy.head;
            if (xLeader === yLeader)
                return null;
            // append the shorter list onto the longer
            if (sx.length > sy.length) {
                // delete the list of node y from this set
                this.lists.delete(yLeader.key);
                while (sy.head) {
                    // take the first node
                    const node = sy.shift();
                    // append onto the end of sx
                    sx.push(node.key);
                    // update pointer
                    this.pointers.set(node.key, node);
                    // Node points to its new list
                    node.list = sx;
                }
                this.lists.set(xLeader.key, sx);
                return this;
            }
            this.lists.delete(xLeader.key);
            while (sx.head) {
                const node = sx.shift();
                sy.push(node.key);
                this.pointers.set(node.key, node);
                node.list = sy;
            }
            this.lists.set(yLeader.key, sy);
            return this;
        };
        this.lists = new Map();
        this.pointers = new Map();
    }
}
export default ListSet;
