import AVLNode from "structures/trees/avl_node";
import Stack from "structures/basics/stack";
// TODO: extend vanilla BST to avoid repeated code
class AVLTree {
    constructor() {
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // Returns true if this AVL Tree is empty
        // Otherwise returns false
        this.isEmpty = () => {
            return this.size === 0;
        };
        // update the height of a given node x
        this.updateHeight = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // if x does not have a child the height of this 'sides is zero
            const leftHeight = x.left !== null ? x.left.height : 0;
            const rightHeight = x.right !== null ? x.right.height : 0;
            x.height = 1 + Math.max(leftHeight, rightHeight);
        };
        // Returns the balance factor of a given node x
        this.getBalanceFactor = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // if x does not have a child the height of this 'sides is zero
            const leftHeight = x.left !== null ? x.left.height : 0;
            const rightHeight = x.right !== null ? x.right.height : 0;
            return leftHeight - rightHeight;
        };
        // Fix the AVL Tree: Performing rotations
        // If any node (from new node x up to root) has a balance factor
        // equals -2 or 2 after inserting the new node.
        // Four Cases:
        // left-left, left-right
        // right-right, right-left
        this.rebalancing = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            let balanceFactor;
            while (x !== null &&
                x.parent !== null &&
                balanceFactor !== 2 &&
                balanceFactor !== -2) {
                // update the height of the x's parent
                this.updateHeight(x.parent);
                balanceFactor = this.getBalanceFactor(x.parent);
                x = x.parent;
            }
            if (balanceFactor === 2) {
                // too left balanced
                // get balance factor of x.left
                // to check if it is a left-left or left-right case
                balanceFactor = this.getBalanceFactor(x.left);
                if (balanceFactor >= 0) {
                    // left-left case
                    this.rightRotate(x);
                }
                else {
                    // left - right case
                    this.leftRotate(x.left);
                    this.rightRotate(x);
                }
            }
            else {
                if (balanceFactor === -2) {
                    // too right balanced
                    // get balance factor of x.right
                    // to check if it is a right-right or right-left case
                    balanceFactor = this.getBalanceFactor(x.left);
                    if (balanceFactor <= 0) {
                        // right-right case
                        this.leftRotate(x);
                    }
                    else {
                        // right-left case
                        this.rightRotate(x.right);
                        this.leftRotate(x);
                    }
                }
            }
        };
        // Replaces one subtree as a child of its parent with another subtree
        //    replaces the subtree rooted at node u with
        //    the subtree rooted at node v
        //    make the parent of u change its pointer to v
        //    v takes u position and parent
        this.transplant = (u, v) => {
            // check if u is the root of this RBT
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
        // Operate a left rotation:
        //    y is the right child of x (NOT NULL)
        //    y's left subtree becomes x's right subtree
        //    x becomes left child of y
        this.leftRotate = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // y can't be null
            if (x.right === null)
                return false;
            const y = x.right;
            // left subtree of y is now the right subtree of x (can be null)
            x.right = y.left;
            if (y.left !== null) {
                // if left child of y is not null update its parent to x
                y.left.parent = x;
            }
            // update the parent of y
            y.parent = x.parent;
            if (x.parent === null) {
                // if x is the root, update y to be the root
                this.root = y;
            }
            else if (x === x.parent.left) {
                // x is a left child
                // update the parent of x to point to y
                x.parent.left = y;
            }
            else {
                // x is a right child
                // update the parent of x to point to y
                x.parent.right = y;
            }
            // update y as parent of x
            y.left = x;
            x.parent = y;
            // update heights
            this.updateHeight(x);
            this.updateHeight(y);
        };
        // Operate a right rotation:
        //    y is the left child of x (NOT NULL)
        //    y's right subtree becomes x's left subtree
        //    x becomes right child of y
        this.rightRotate = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // y can't be null
            if (x.left === null)
                return false;
            const y = x.left;
            // right subtree of y is now the right subtree of x (can be null)
            x.left = y.right;
            if (y.right !== null) {
                // if right child of y is not null update its parent to x
                y.right.parent = x;
            }
            // update the parent of y
            y.parent = x.parent;
            if (x.parent === null) {
                // if x is the root, update y to be the root
                this.root = y;
            }
            else if (x === x.parent.left) {
                // x is a left child
                // update the parent of x to point to y
                x.parent.left = y;
            }
            else {
                // x is a right child
                // update the parent of x to point to y
                x.parent.right = y;
            }
            // update y as parent of x
            y.right = x;
            x.parent = y;
            // update heights
            this.updateHeight(x);
            this.updateHeight(y);
        };
        //   **********************************************************
        //                    DYNAMIC-SET OPERATIONS
        //   **********************************************************
        // Returns the node of this val, or null
        this.find = (val) => {
            if (this.isEmpty())
                return false;
            let current = this.root;
            while (current !== null && current.val !== val) {
                if (current.val > val) {
                    // check left
                    current = current.left;
                }
                else {
                    // check right
                    current = current.right;
                }
            }
            return current;
        };
        // Returns true if this AVL Tree contains this val,
        // Otherwise returns false
        this.contains = (val) => {
            return this.find(val) !== null;
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
        //                            INSERT
        //   **********************************************************
        // Inserts a node in the right (correct) position and rearrange
        // Returns this AVL Tree
        // Removed: Returns false whether this val is already in this AVL Tree
        // Duplicated vals allowed, to change just remove comment returning false
        this.insert = (val) => {
            let node = new AVLNode(val);
            if (this.isEmpty()) {
                this.size++;
                this.root = node;
                return this;
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
                        this.rebalancing(node);
                        return this;
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
                        this.rebalancing(node);
                        return this;
                    }
                    // update current
                    current = current.right;
                }
            }
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Deletes node x from this BST
        // 4 cases:
        //    no child: just change the pointer of x's parent to null
        //    one child: child takes x place
        //    two children: sucessor of x takes it place
        this.delete = (x) => {
            // Returns false if x is not a valid node
            if (!(x instanceof Node))
                return false;
            if (this.isEmpty())
                return false;
            // no left child
            if (x.left === null) {
                // if x.right is also null just update the pointer of x's parent (to null)
                this.transplant(x, x.right);
            }
            else if (x.right === null) {
                // x has left child but not a right child
                this.transplant(x, x.left);
            }
            else {
                // two childrens
                // sucessor is the node with smallest val in the right subtree
                const sucessor = this.min(x.right);
                if (!sucessor)
                    return false;
                if (x !== sucessor.parent) {
                    // If sucessor is not the right child of x
                    // Remember: sucessor has no left child
                    //      otherwise sucessor.left would be the sucessor
                    // change the sucessor place with sucessor child
                    //      (we will change sucessor with x in the next step)
                    this.transplant(sucessor, sucessor.right);
                    sucessor.right = x.right;
                    sucessor.right.parent = sucessor;
                    this.updateHeight(sucessor.right);
                }
                // OR the sucessor is the right child of x
                // OR the sucessor was prepared in the last if
                //    Anyway we just transplant and update pointers to left subtree
                this.transplant(x, sucessor);
                // uodate sucessor left (from null) to left subtree
                sucessor.left = x.left;
                // update left subtree parent (from x) to sucessor
                sucessor.left.parent = sucessor;
                this.updateHeight(sucessor);
            }
            this.updateHeight(x);
            this.rebalancing(x);
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
export default AVLTree;
