class ForestNode {
    constructor(key) {
        this.key = key;
        this.rank = 0;
        this.parent = this;
    }
}
export default ForestNode;
