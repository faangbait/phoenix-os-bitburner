import RBNode from "structures/trees/rbt_node";
import Stack from "structures/basics/stack";
// TODO: extend vanilla BST to avoid repeated code
class RedBlackTree {
    constructor() {
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // Returns true if this RBT is empty
        // Otherwise returns false
        this.isEmpty = () => {
            return this.size === 0;
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
        //   **********************************************************
        //                    DYNAMIC-SET OPERATIONS
        //   **********************************************************
        // Returns true if this RBT contains this val,
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
        //                            INSERT
        //   **********************************************************
        // Inserts a node in the right (correct) position and rearrange
        // Returns this RBT
        // Returns false whether this val is already in this RBT
        this.insert = (val) => {
            // new node has color red
            let node = new RBNode(val, "red");
            if (this.isEmpty()) {
                this.size++;
                this.root = node;
                this.insertFixup(node);
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
                        this.insertFixup(node);
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
                        this.insertFixup(node);
                        return this;
                    }
                    // update current
                    current = current.right;
                }
            }
        };
        // To fix the RBT if any property is violated
        //      Two reds in a row
        //      Root is not black
        // CASE 1: the uncle of z (new node) y is also red (z's grandpa MUST be black)
        //      Color both z's parent and uncle black
        //      And z's grandpa red
        // CASE 2/3 : z's uncle y is black and z is right/ left child
        //      Left rotation in case 2 and changing z pointer -> CASE 3
        //      Right rotation and color changing between z's parent and grandpa
        // FIXME: case 3 in else statement, z.parent! retuning null
        this.insertFixup = (z) => {
            // two reds in a row
            while (z !== null &&
                z.parent !== null &&
                z.parent.parent !== null &&
                z.parent.color === "red") {
                // the parent of z is a left child
                if (z.parent === z.parent.parent.left) {
                    // y (z's uncle) is a right child
                    const y = z.parent.parent.right;
                    // CASE 1
                    if (y !== null && y.color === "red") {
                        z.parent.color = "black";
                        y.color = "black";
                        z.parent.parent.color = "red";
                        // to update (propagate) z
                        z = z.parent.parent;
                    }
                    else {
                        // CASE 2
                        if (z === z.parent.right) {
                            // to update (propagate) z
                            z = z.parent;
                            this.leftRotate(z);
                        }
                        // CASE 3
                        z.parent.color = "black";
                        z.parent.parent.color = "red";
                        this.rightRotate(z.parent.parent);
                    }
                }
                // the parent of z is a right child
                else {
                    // y (z's uncle) is a left child
                    const y = z.parent.parent.left;
                    // CASE 1
                    if (y !== null && y.color === "red") {
                        z.parent.color = "black";
                        y.color = "black";
                        z.parent.parent.color = "red";
                        // to update (propagate) z
                        z = z.parent.parent;
                    }
                    else {
                        // CASE 2
                        if (z === z.parent.left) {
                            // to update (propagate) z
                            z = z.parent;
                            this.rightRotate(z);
                        }
                        // CASE 3
                        z.parent.color = "black";
                        z.parent.parent.color = "red";
                        this.leftRotate(z.parent.parent);
                    }
                }
            }
            // Root must be black
            this.root.color = "black";
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Deletes node z from this RBT
        // 4 cases:
        //    no child: just change the pointer of z's parent to null
        //    one child: child takes z place
        //    two children: sucessor of z takes it place
        this.delete = (z) => {
            // Returns false if z is not a valid node
            if (!(z instanceof RBNode))
                return false;
            if (this.isEmpty())
                return false;
            if (this.size === 1) {
                this.size = 0;
                this.root = null;
                return;
            }
            // we need to keep track of x and y, they might cause violantions
            // fewer than 2 children: we want y to be z
            let y = z;
            // z's color
            let yOriginalColor = y.color;
            // moves into y's original position
            let x;
            // no left child
            if (z.left === null) {
                x = z.right;
                // if z is also null just update the pointer of z's parent (to null)
                this.transplant(z, z.right);
            }
            else if (z.right === null) {
                x = z.left;
                // z has left child but not a right child
                this.transplant(z, z.left);
            }
            else {
                // two childrens
                // y is z's sucessor, and y moves to z's position
                // sucessor is the node with smallest val in the right subtree
                y = this.min(z.right);
                if (!y)
                    return false;
                // y has the color of the z's sucessor too
                yOriginalColor = y.color;
                x = y.right;
                if (z === y.parent) {
                    // If sucessor is the right child of z
                    // x parent points to the original position of y’s parent
                    if (x !== null)
                        x.parent = y;
                }
                else {
                    // If sucessor is not the right child of z
                    // Remember: sucessor has no left child
                    //      otherwise sucessor.left would be the sucessor
                    // change the sucessor place with sucessor child
                    //      (we will change sucessor with z in the next step)
                    this.transplant(y, y.right);
                    y.right = z.right;
                    y.right.parent = y;
                }
                // OR the sucessor is the right child of z
                // OR the sucessor was prepared in the last if
                //    Anyway we just transplant and update pointers to left subtree
                this.transplant(z, y);
                // uodate sucessor left (from null) to left subtree
                y.left = z.left;
                // update left subtree parent (from z) to sucessor
                y.left.parent = y;
                // update y color
                y.color = z.color;
            }
            if (x !== null && yOriginalColor === "black") {
                // y red color dont violate any property
                this.deleteFixup(x);
            }
            this.size--;
        };
        this.deleteFixup = (x) => {
            // move the extra black up
            while (x !== this.root && x.color === "black") {
                // x is a left child
                if (x === x.parent.left) {
                    // w is the sibling of x
                    let w = x.parent.right;
                    // CASE 1: w (x's sibling) is red
                    if (w.color === "red") {
                        // the children of w MUST be black
                        // switch the colors of w and its parent
                        w.color = "black";
                        x.parent.color = "red";
                        // left-rotation on x.parent
                        this.leftRotate(x.parent);
                        // update w (x's sibling)
                        w = x.parent.right;
                    }
                    // CASE 2: w (x's sibling) is black and both children are black too
                    if (w.left.color === "black" && w.right.color === "black") {
                        // make w red
                        w.color = "red";
                        // To compensate for removing one black
                        // repeate the while loop with x.parent as the new node x
                        x = x.parent;
                        continue;
                    }
                    // CASE 3: w (x's sibling) is black, left child of w is red,
                    //      right child of w is black
                    else if (w.right.color === "black") {
                        // switch the colors of w and its left child
                        w.color = "red";
                        w.left.color = "black";
                        // right roration on w
                        this.rightRotate(w);
                        // update w
                        w = x.parent.right;
                    }
                    // CASE 4: w (x's sibling) is black, the right child of w is red
                    if (w.right.color === "red") {
                        // Remove the extra black and finish
                        w.color = x.parent.color;
                        x.parent.color = "black";
                        w.right.color = "black";
                        this.leftRotate(x.parent);
                        x = this.root;
                    }
                }
                // x is a right child
                else {
                    // w is the sibling of x
                    let w = x.parent.left;
                    // CASE 1: w (x's sibling) is red
                    if (w.color === "red") {
                        // the children of w MUST be black
                        // switch the colors of w and its parent
                        w.color = "black";
                        x.parent.color = "red";
                        // left-rotation on x.parent
                        this.rightRotate(x.parent);
                        // update w (x's sibling)
                        w = x.parent.left;
                    }
                    // CASE 2: w (x's sibling) is black and both children are black too
                    if (w.left.color === "black" && w.right.color === "black") {
                        // make w red
                        w.color = "red";
                        // To compensate for removing one black
                        // repeate the while loop with x.parent as the new node x
                        x = x.parent;
                        continue;
                    }
                    // CASE 3: w (x's sibling) is black, right child of w is red,
                    //      left child of w is black
                    else if (w.left.color === "black") {
                        // switch the colors of w and its right child
                        w.color = "red";
                        w.right.color = "black";
                        // right roration on w
                        this.leftRotate(w);
                        // update w
                        w = x.parent.left;
                    }
                    // CASE 4: w (x's sibling) is black, the left child of w is red
                    if (w.left.color === "red") {
                        // Remove the extra black and finish
                        w.color = x.parent.color;
                        x.parent.color = "black";
                        w.left.color = "black";
                        this.rightRotate(x.parent);
                        x = this.root;
                    }
                }
            }
            x.color = "black";
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
export default RedBlackTree;
