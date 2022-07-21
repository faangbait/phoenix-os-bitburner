import BSTNode from "structures/trees/bst_node";
import Stack from "structures/basics/stack";
// TODO:  test
class BST {
    constructor() {
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // Returns true if this BST is empty
        // Otherwise returns false
        this.isEmpty = () => {
            return this.size === 0;
        };
        // Replaces one subtree as a child of its parent with another subtree
        //    replaces the subtree rooted at node u with
        //    the subtree rooted at node v
        //    make the parent of u change its pointer to v
        //    v takes u position and parent
        this.transplant = (u, v) => {
            // check if u is the root of this BST
            if (u.parent === null) {
                this.root = v;
            }
            // check if u is a left child
            else if (u === u.parent.left) {
                u.parent.left = v;
            }
            else {
                // right child
                u.parent.right = v;
            }
            // if v is null DON'T update
            if (v !== null)
                v.parent = u.parent;
        };
        //   **********************************************************
        //                            INSERT
        //   **********************************************************
        // Inserts a node in the right position and rearrange
        // Returns the inserted node
        // Returns false whether this val is already in this BST
        this.insert = (val) => {
            let node = new BSTNode(val);
            if (this.isEmpty()) {
                this.size++;
                this.root = node;
                return node;
            }
            let current = this.root;
            while (current !== null) {
                // duplicate val
                // if (current.val === node.val) return false;
                // check left
                if (current.val > node.val) {
                    if (!current.left) {
                        node.parent = current;
                        current.left = node;
                        this.size++;
                        return node;
                    }
                    // update current to left
                    current = current.left;
                    // check right
                }
                else {
                    if (!current.right) {
                        node.parent = current;
                        current.right = node;
                        this.size++;
                        return node;
                    }
                    // update current
                    current = current.right;
                }
            }
        };
        //   **********************************************************
        //                            SEARCH
        //   **********************************************************
        this.search = (val) => {
            if (this.isEmpty())
                return false;
            let current = this.root;
            while (current !== null) {
                if (current.val === val)
                    return current;
                if (current.val > val) {
                    current = current.left;
                }
                else {
                    current = current.right;
                }
            }
        };
        // Returns true if this BST contains this val,
        // Otherwise returns false
        this.contains = (val) => {
            if (this.isEmpty())
                return false;
            let current = this.root;
            while (current !== null) {
                // if we find return true
                if (current.val === val)
                    return true;
                // check left
                if (current.val > val) {
                    current = current.left;
                }
                else {
                    // check right
                    current = current.right;
                }
            }
            // if we didnt find return flase
            return false;
        };
        // Returns the min node from the subtree who has x as root
        this.min = (x = this.root) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            while (x.left !== null) {
                x = x.left;
            }
            return x;
        };
        // Returns the max node from the subtree who has x as root
        this.max = (x = this.root) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            while (x.right !== null) {
                x = x.right;
            }
            return x;
        };
        // Returns the successor node y (node who has the next val in crescent order)
        //    of a given node x
        this.sucessor = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // check if there is a right subtree
            if (x.right !== null) {
                // sucessor is the leftmost node in this subtree
                return this.min(x.right);
            }
            // go up until we find a node who is the left child
            // its parent is the sucessor
            let y = x.parent;
            // while x is the right child (its parent y is smaller than x) we update
            while (y !== null && x === y.right) {
                x = y;
                y = y.parent;
            }
            return y;
        };
        // Returns the predecessor node y (node who has the previous val in crescent order)
        //    of a given node x
        this.predecessor = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // check if there is a left subtree
            if (x.left !== null) {
                // predecessor is the rightmost node in this subtree
                return this.max(x.left);
            }
            // go up until we find a node who is the right child
            // its parent is the predecessor
            let y = x.parent;
            // while x is the left child (its parent y is greater than x) we update
            while (y !== null && x === y.left) {
                x = y;
                y = y.parent;
            }
            return y;
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Deletes node z from this BST
        // 4 cases:
        //    no child: just change the pointer of z's parent to null
        //    one child: child takes z place
        //    two children: sucessor of z takes it place
        this.delete = (z) => {
            // Returns false if z is not a valid node
            if (!(z instanceof BSTNode))
                return false;
            if (this.isEmpty())
                return false;
            // no left child
            if (z.left === null) {
                // if z is also null just update the pointer of z's parent (to null)
                this.transplant(z, z.right);
            }
            else if (z.right === null) {
                // z has left child but not a right child
                this.transplant(z, z.left);
            }
            else {
                // two childrens
                // sucessor is the node with smallest val in the right subtree
                const sucessor = this.min(z.right);
                if (!sucessor)
                    return false;
                if (z !== sucessor.parent) {
                    // If sucessor is not the right child of z
                    // Remember: sucessor has no left child
                    //      otherwise sucessor.left would be the sucessor
                    // change the sucessor place with sucessor child
                    //      (we will change sucessor with z in the next step)
                    this.transplant(sucessor, sucessor.right);
                    sucessor.right = z.right;
                    sucessor.right.parent = sucessor;
                }
                // OR the sucessor is the right child of z
                // OR the sucessor was prepared in the last if
                //    Anyway we just transplant and update pointers to left subtree
                this.transplant(z, sucessor);
                // update sucessor left (from null) to left subtree
                sucessor.left = z.left;
                // update left subtree parent (from z) to sucessor
                sucessor.left.parent = sucessor;
            }
            this.size--;
        };
        //   **********************************************************
        //                        TRANSVERSING
        //   **********************************************************
        this.preOrderTreeWalk = (x, arr = []) => {
            if (x) {
                arr.push(x.val);
                this.preOrderTreeWalk(x.left, arr);
                this.preOrderTreeWalk(x.right, arr);
            }
            // check if all nodes already visited
            if (this.size === arr.length)
                return arr;
        };
        // to tranverse all BST, in order
        // expect x = root in 1st call
        this.inOrderTreeWalk = (x, arr = []) => {
            if (x) {
                this.inOrderTreeWalk(x.left, arr);
                arr.push(x.val);
                this.inOrderTreeWalk(x.right, arr);
            }
            if (this.size === arr.length)
                return arr;
        };
        // to tranverse the BST, only add to arr nodes inside [s,t]
        this.inOrderTreeWalkInterval = (x, s, t, arr = []) => {
            if (x) {
                this.inOrderTreeWalkInterval(x.left, s, t, arr);
                if (x.val >= s && x.val <= t)
                    arr.push(x.val);
                this.inOrderTreeWalkInterval(x.right, s, t, arr);
                if (x.val === t)
                    return arr;
            }
        };
        this.inOrderTreeWalkStack = () => {
            const stack = new Stack();
            const arr = [];
            let current = this.root;
            while (stack.size !== 0 || current !== null) {
                if (current) {
                    // stack to remember previous node
                    stack.push(current);
                    current = current.left;
                }
                else {
                    // no left child to add (min available node found)
                    // come back to previous node
                    current = stack.pop().key;
                    // To add only insede an interval [s,t]:
                    //  check if  s <= current.val <= t
                    //  if we found t we can finish
                    arr.push(current.val);
                    // lets try right child
                    current = current.right;
                }
            }
            return arr;
        };
        this.posOrderTreeWalk = (x, arr = []) => {
            if (x) {
                this.preOrderTreeWalk(x.left, arr);
                this.preOrderTreeWalk(x.right, arr);
                arr.push(x.val);
            }
            // check if all nodes already visited
            if (this.size === arr.length)
                return arr;
        };
        this.root = null;
        this.size = 0;
    }
}
export default BST;
