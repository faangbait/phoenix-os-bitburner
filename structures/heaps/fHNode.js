class FHNode {
    constructor(key, val) {
        this.key = key;
        this.val = val;
        // LCRS representation
        this.parent = null;
        this.child = null;
        // siblings
        this.left = null;
        this.right = null;
        // number of children
        this.degree = 0;
        // to control child lost
        this.mark = false;
    }
}
export default FHNode;
