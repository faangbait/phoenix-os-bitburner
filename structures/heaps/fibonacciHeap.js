import FHNode from "structures/heaps/fHNode";
class FibonacciHeap {
    constructor() {
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // Returns true if this heap is empty
        // Otherwise returns false
        this.isEmpty = () => {
            return this.size === 0;
        };
        // Adds a node to the root list
        // Also update the parent of node to null
        //    Can be a new one or any node which is already in FH but not in the root list
        // [...] <-> t <-> min <-> [...]   adds  node
        // [...] <-> t <- node -> <- min <-> [...]
        // If this FH is empty: Create the root list containing just node
        //    node becomes min and points to itself
        //    An only child points to itself in left and right
        this.addToRootList = (node) => {
            if (this.isEmpty() || this.min === null) {
                this.min = node;
                this.min.left = node;
                this.min.right = node;
            }
            else {
                // pointing to siblings in root list
                const t = this.min.left;
                this.min.left = node;
                node.left = t;
                t.right = node;
                node.right = this.min;
            }
            // node does not have a parent any more
            node.parent = null;
        };
        // Concatenates this min root list with root list of a given node( min of h2 = min2)
        // [...] <-> min1 <-> t1 <-> [...], [...] <-> t2 <-> min2 <-> [...]
        // [...] t2 <-> t1 <->[...] <-> min1 <-> min2 <-> [...]
        this.concatenate = (node) => {
            const t1 = this.min.right;
            const t2 = node.left;
            this.min.right = node;
            node.left = this.min;
            t1.left = t2;
            t2.right = t1;
        };
        // Removes node from this FH
        // [...] <-> t <-> node <-> t2 <-> [...]
        // [...] <-> t <-> t2 <-> [...]
        // Returns false if node is not in Root List
        // Removing node from root list does not change any attribute in node
        this.removeFromRootList = (node) => {
            // check if node is in Root list
            if (node.parent !== null || node.left === null || node.right === null) {
                return false;
            }
            const t = node.left;
            const t2 = node.right;
            // pointing to the new siblings, no one points to node any more
            t.right = t2;
            t2.left = t;
        };
        // Makes y node child of x node
        this.makeYchildOfX = (x, y) => {
            y.parent = x;
            // check if y is the first child
            if (x.degree === 0) {
                x.child = y;
                // y has no siblings, only child points to itself!
                y.left = y;
                y.right = y;
            }
            else {
                // y is not the first, connect y to its siblings!
                // child <-> t <-> [...], y
                // child <-> y <-> t <-> [...]
                const child = x.child;
                const t = child.right;
                // changing pointers
                child.right = y;
                y.left = child;
                y.right = t;
                if (t !== null)
                    t.left = y;
            }
        };
        // Removes x from the child list of y, and decremente y degree
        // Removing x from child list of y does not change any attribute in x
        this.removeXFromParentY = (x, y) => {
            // check if x was only child
            if (y.degree === 1) {
                y.child = null;
            }
            else {
                // check if y.child points to x
                if (y.child === x) {
                    // point to any other child
                    y.child = x.right;
                }
                else {
                    // we need to find x in this child list and remove pointers
                    let t = y.child;
                    while (t !== x) {
                        // we find x
                        if (t.right === x) {
                            // [...] <-> t <-> x <-> x.right <-> [...]
                            t.right = x.right;
                            x.right.left = t;
                            break;
                        }
                        // moving to the next sibling
                        t = t.right;
                    }
                }
            }
            y.degree--;
        };
        // Removes x from child list of y
        // Add x to child list (update parent of x to null)
        // clear x.mark
        this.cut = (x, y) => {
            // Remove x from child list of y and decrease degree of y
            this.removeXFromParentY(x, y);
            // add to root and update x.parent to null
            this.addToRootList(x);
            // clear x mark
            x.mark = false;
        };
        // if y already lost a child (y.mark === true)
        // cut link between y and y.parent and call cascading cut to y.parent
        // if is the first child that y lost, mark y
        // if y is already a root it doesn't matter
        this.cascadingCut = (y) => {
            const z = y.parent;
            // check if y is not a root
            if (z !== null) {
                // first lost
                if (y.mark === false) {
                    y.mark = true;
                }
                else {
                    // second lost
                    // cut link between y and z
                    this.cut(y, z);
                    // z lost a child so call cascadingCut for it
                    this.cascadingCut(z);
                }
            }
        };
        // Links two roots, which have same degree, into a single one
        // x will be the parent, so x MUST to be smaller than y
        // Returns false if x is greater than y
        this.link = (x, y) => {
            // check if x.val < y.val
            if (y.val < x.val)
                return false;
            this.removeFromRootList(y);
            this.makeYchildOfX(x, y);
            x.degree += 1;
            y.mark = false;
        };
        // Ensures that every root has distinct degree
        //    Search roots with same degree and link
        //    until there is at most one root with each degree
        // O(maxDegree) = O(log n)
        this.consolidate = () => {
            // max degree := log(n)
            // increase 1 because maxDegree is inclusive [0,maxDregree]
            let maxDegree = Math.ceil(Math.log2(this.size)) + 2;
            // to keep track the root's degree
            const a = new Array(maxDegree).fill(null);
            let w = this.min;
            // removing pointer from left sibling of min to min
            // left <-> min <-> [...]
            // left <- min <-> [...]
            this.min.left.right = null;
            // for each node w in the root list
            while (w !== null) {
                let x = w;
                let d = x.degree;
                const next = x.right;
                // in each step we remove the pointer to the right sibling
                w.right = null;
                // check if there is any other root with the same degree d
                while (a[d] !== null) {
                    // y is another root (besides x) with the same degree d
                    let y = a[d];
                    if (x.key === y.key)
                        break;
                    // if (x.key === y.key) break;
                    if (y.val < x.val) {
                        // exhange pointers, x MUST be the smaller
                        [x, y] = [y, x];
                    }
                    this.link(x, y);
                    // after link x and y, y is child of x, and x has degree d + 1
                    a[d] = null;
                    d += 1;
                }
                // a[d] points to x
                a[d] = x;
                // update w
                w = next;
            }
            // Reconstructing Root list
            this.min = null;
            for (let i = 0; i < maxDegree; i++) {
                if (a[i] !== null) {
                    // add node a[i] to the root list
                    // if min is null or heap is empty add a[i] as the min
                    this.addToRootList(a[i]);
                    if (a[i].val < this.min.val) {
                        this.min = a[i];
                    }
                }
            }
        };
        //   **********************************************************
        //                            ACCESSING
        //   **********************************************************
        // Returns the min node
        // Returns null if this Heap is empty
        this.findMin = () => {
            if (this.isEmpty())
                return null;
            return this.min;
        };
        //   **********************************************************
        //                            CREATE
        //   **********************************************************
        this.buildHeap = (map) => {
            // Returns false if this heap is not empty
            if (!this.isEmpty())
                return false;
            const pointers = new Map();
            // inject each element of arr (key, val) to this.value
            map.forEach((value, key) => {
                const node = this.enqueue(key, value);
                pointers.set(key, node);
            });
            return pointers;
        };
        //   **********************************************************
        //                            INSERT
        //   **********************************************************
        // Inserts a node (key,val) in the root List
        // Returns the node inserted
        this.enqueue = (key, val) => {
            const node = new FHNode(key, val);
            // if heap is empty or min is null, set node as min
            this.addToRootList(node);
            if (node.val < this.min.val) {
                this.min = node;
            }
            this.size++;
            return node;
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Removes the root (min),
        // Returns the root
        //    It's where the delayed work of consolidating trees
        //    in root list finally occurs
        // Returns null if this heap is empty
        this.dequeue = () => {
            if (this.isEmpty())
                return null;
            // saving pointer to min
            const z = this.min;
            if (z.child !== null) {
                let x = z.child;
                // to keep each child
                const chidrenOfz = [];
                // removing pointer from left sibling of x to x
                // left <-> x <-> [...]
                // left <- x <-> [...]
                x.left.right = null;
                // for each child x of z: we want to remove z as parent of each x
                while (x !== null) {
                    const next = x.right;
                    // in each step we remove the pointer to the right sibling
                    x.right = null;
                    chidrenOfz.push(x);
                    // z is no longer parent of x
                    x.parent = null;
                    // update x
                    x = next;
                }
                chidrenOfz.forEach((x) => {
                    this.addToRootList(x);
                });
            }
            this.removeFromRootList(z);
            // check if z was the last element in this FH
            if (this.size === 1) {
                this.min = null;
            }
            else {
                // set a new(any) min and consolidate
                this.min = z.right;
                this.consolidate();
            }
            // decrease size
            this.size -= 1;
            // return { element: z, heap: this };
            return z;
        };
        // Removes the node from this respect key
        // Returns this HEAP
        this.deleteKey = (x) => {
            // if x is not an instance of FHNode returns false
            if (!(x instanceof FHNode))
                return false;
            this.decreaseKey(x, Number.NEGATIVE_INFINITY);
            this.dequeue();
            return this;
        };
        //   **********************************************************
        //                            UNION
        //   **********************************************************
        // Returns a new FH h, which is the union between this FH and h2
        // Returns false if any FH is empty
        this.union = (h2) => {
            if (this.isEmpty() || h2.isEmpty())
                return false;
            const h = new FibonacciHeap();
            h.min = this.min;
            h.concatenate(h2.min);
            if (h2.min.val < this.min.val) {
                h.min = h2.min;
            }
            h.size = this.size + h2.size;
            return h;
        };
        //   **********************************************************
        //                            UPDATE
        //   **********************************************************
        // Update the val of node x
        // Returns false if x is not an instance of FHNode
        // Returns false if newVal is not smaller than the actual val
        // if new val and the actual val of x are the same returns node x
        this.decreaseKey = (x, newVal) => {
            // if x is not an instance of FHNode returns false
            if (!(x instanceof FHNode))
                return false;
            // to ensure newVal < val
            if (newVal > x.val)
                return false;
            // if they are the same return this
            if (newVal === x.val)
                return false;
            // update x
            x.val = newVal;
            const y = x.parent;
            // if x does not have a parent or if its new val is
            // still greater than the val of its parent
            // any changes in this FH structure are needed
            // (check if min-heap invariant still valid)
            if (y !== null && x.val < y.val) {
                // x is smaller than its parent
                // cut link between x and y and decrease y.degree
                // and rearrange FH structure
                this.cut(x, y);
                this.cascadingCut(y);
            }
            if (x.val < this.min.val) {
                this.min = x;
            }
            return x;
        };
        this.size = 0;
        this.min = null;
    }
}
export default FibonacciHeap;
