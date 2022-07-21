import ForestNode from "structures/disjoint-sets/forestNode";
class ForestSet {
    constructor() {
        this.makeSet = (x) => {
            const node = new ForestNode(x);
            this.pointers.set(x, node);
        };
        this.findSet = (x) => {
            if (!this.pointers.get(x))
                return null;
            let node = this.pointers.get(x);
            if (node.parent.key !== node.key) {
                // Path Compression
                node.parent = this.findSet(node.parent.key);
            }
            return node.parent;
        };
        this.link = (x, y) => {
            // Union by Rank
            if (x.rank > y.rank) {
                y.parent = x;
            }
            else {
                x.parent = y;
                if (x.rank === y.rank)
                    y.rank++;
            }
        };
        this.union = (x, y) => {
            this.link(this.findSet(x), this.findSet(y));
        };
        this.pointers = new Map();
    }
}
export default ForestSet;
