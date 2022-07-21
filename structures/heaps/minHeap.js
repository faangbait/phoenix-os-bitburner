// TODO: Add unit test
import BHNode from "structures/heaps/bHNode";
class MinHeap {
    constructor() {
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // Returns true if the element from index i is smaller than k idx element
        // otherwise returns false
        this.lessThan = (i, k) => {
            // out of bounds
            if (i < 0 || k < 0)
                return false;
            if (i > this.size - 1 || k > this.size - 1)
                return false;
            if (this.values[i].val < this.values[k].val)
                return true;
            return false;
        };
        // Returns the parent's index of the ith node
        this.myParentIdx = (i) => {
            return Math.floor((i - 1) / 2);
        };
        // Returns the children's index of the ith node
        this.myChildrenIdx = (i) => {
            // left 2 * i + 1 , right 2 * idx + 2
            return [2 * i + 1, 2 * i + 2];
        };
        // swap idxs elements in map key to idx
        this.swapIdxs = (a, b) => {
            const temp = this.idxs.get(a);
            this.idxs.set(a, this.idxs.get(b));
            this.idxs.set(b, temp);
        };
        // Rearrange values and map
        this.bubbleUp = (i, j) => {
            //swap i and j
            [this.values[i], this.values[j]] = [this.values[j], this.values[i]];
            // swap idxs elements in map key to idx
            const a = this.values[i].key;
            const b = this.values[j].key;
            this.swapIdxs(a, b);
        };
        // Returns the smmaller child idx
        // Rearrange values and map
        this.bubbleDown = (idx, l, r) => {
            // to keep track of the smallest child
            let smallIdx;
            if (this.lessThan(l, r)) {
                smallIdx = l;
            }
            else if (this.lessThan(r, l)) {
                smallIdx = r;
                // if they have the same val we take the left child as the smallest
            }
            else {
                smallIdx = l;
            }
            // swap parent and smaller child
            [this.values[idx], this.values[smallIdx]] = [
                this.values[smallIdx],
                this.values[idx],
            ];
            // swap idxs elements in map key to idx
            const a = this.values[idx].key;
            const b = this.values[smallIdx].key;
            this.swapIdxs(a, b);
            return smallIdx;
        };
        // Returns true if this heap constains this key
        // Otherwise returns false
        this.contains = (key) => {
            if (this.idxs.get(key) === undefined)
                return false;
            return true;
        };
        // Returns true if this heap is empty
        // Otherwise returns false
        this.isEmpty = () => {
            return this.size === 0;
        };
        //   **********************************************************
        //                            CREATING
        //   **********************************************************
        // arr: array, Map
        // keys: array
        // If arr is an array
        //    Each node of this Heap will be the (keys[i], arr[i]) where i is the index,
        //    arr and keys MUST have the same size
        //    Duplicate keys are not allowed. Returns false
        // If arr is a Map:
        //    each node of this Heap will be the (key, val) of each element of arr
        //    In this case second param <keys> is not used
        // In any case the Heap is build in linear time
        // Returns: this Heap
        // TODO: static method
        this.buildHeap = (arr, keys) => {
            // Returns false if this heap is not empty
            if (!this.isEmpty())
                return false;
            // arr is an array
            if (Array.isArray(arr)) {
                // arr is array AND keys is also an array
                if (Array.isArray(keys)) {
                    // if arr and keys dont have the same size returns false
                    if (arr.length !== keys.length)
                        return false;
                    // set size of this heap to the size of arr
                    this.size = arr.length;
                    // inject arr and keys in this.value (keys[i],arr[i])
                    for (let i = 0; i < this.size; i++) {
                        // Avoiding duplicate keys
                        if (this.contains(keys[i]))
                            return false;
                        this.values.push(new BHNode(keys[i], arr[i]));
                        // this.idxs[keys[i]] = i;
                        this.idxs.set(keys[i], i);
                    }
                }
            }
            else if (arr instanceof Map) {
                let i = 0;
                arr.forEach((value, key) => {
                    this.values.push(new BHNode(key, value));
                    this.idxs.set(keys[i], i);
                    i++;
                    this.size++;
                });
            }
            // to heapify all sub heaps with root in index i
            // all leaves are already heaps
            let lChild, rChild, idx;
            for (let i = Math.floor(this.size / 2); i >= 0; i--) {
                [lChild, rChild] = this.myChildrenIdx(i);
                idx = i;
                // bubble-down (while any child is smaller than the parent)
                while (this.lessThan(lChild, idx) || this.lessThan(rChild, idx)) {
                    // update idx and its children
                    idx = this.bubbleDown(idx, lChild, rChild);
                    [lChild, rChild] = this.myChildrenIdx(idx);
                }
            }
            return this;
        };
        //   **********************************************************
        //                            ACCESSING
        //   **********************************************************
        // Returns the root node
        // Returns null if this Heap is empty
        this.findMin = () => {
            if (this.isEmpty())
                return null;
            return this.values[0];
        };
        // Returns the value of this key
        // Returns null whether this key does not belong to this heap
        this.valueOf = (key) => {
            if (!this.contains(key))
                return null;
            const idx = this.idxs.get(key);
            return this.values[idx];
        };
        //   **********************************************************
        //                            INSERT
        //   **********************************************************
        // Inserts a node (key,val) in the last position and rearrange
        // Returns the node inserted
        // Returns false whether this key is already in this heap
        this.enqueue = (key, val) => {
            // to avoid duplicate keys
            if (this.contains(key))
                return false;
            let node = new BHNode(key, val);
            this.values.push(node);
            this.size++;
            // last position to insert this new node
            let idx = this.size - 1;
            // add the idx of this key on the map
            this.idxs.set(key, idx);
            let parentIdx = this.myParentIdx(idx);
            // bubble-up (while this new node is smaller than its parent)
            while (this.lessThan(idx, parentIdx)) {
                this.bubbleUp(idx, parentIdx);
                //   recalculate node idx, parent idx position
                idx = parentIdx;
                parentIdx = this.myParentIdx(idx);
            }
            return node;
        };
        //   **********************************************************
        //                            UPDATE
        //   **********************************************************
        // Update the val of this key
        // Returns true if works
        // Returns false if there is not any node with this key in this heap
        // Returns undefined if newVal is equal to the actual val of key
        // Returns -1 if newVal is greater than the actual val of key
        this.decreaseKey = (key, newVal) => {
            // check whether this key belongs to this heap
            if (!this.contains(key))
                return false;
            let idx = this.idxs.get(key);
            // to ensure newVal < val
            if (newVal > this.values[idx].val)
                return -1;
            // if they are the same just return
            if (newVal === this.values[idx].val)
                return;
            //   update node with new val
            this.values[idx].val = newVal;
            let parentIdx = this.myParentIdx(idx);
            // bubble-up (while this new node is smaller than its parent)
            while (this.lessThan(idx, parentIdx)) {
                this.bubbleUp(idx, parentIdx);
                //   recalculate node idx, parent idx position
                idx = parentIdx;
                parentIdx = this.myParentIdx(idx);
            }
            return true;
        };
        // Update the val of this key
        // Returns true if works
        // Returns false if there is not any node with this key in this heap
        // Returns undefined if newVal is equal to the actual val
        // Returns -1 if newVal is smaller than the actual val
        this.increaseKey = (key, newVal) => {
            // check whether this key belongs to this heap
            if (!this.contains(key))
                return false;
            let idx = this.idxs.get(key);
            // to ensure newVal > val
            if (newVal < this.values[idx].val)
                return -1;
            // if they are the same just return
            if (newVal === this.values[idx].val)
                return;
            //   update node with new val
            this.values[idx].val = newVal;
            let [lChild, rChild] = this.myChildrenIdx(idx);
            // bubble-down (while any child is smaller than the parent)
            while (this.lessThan(lChild, idx) || this.lessThan(rChild, idx)) {
                // update idx and its children
                idx = this.bubbleDown(idx, lChild, rChild);
                [lChild, rChild] = this.myChildrenIdx(idx);
            }
            return true;
        };
        // Returns false if there is not any node with this key in this heap
        // Returns undefined if newVal equals to the actual val
        // if newVal is greater than the actual val calls increaseKey
        // if newVal is smaller than the actual val calls decreaseKey
        this.updateKey = (key, newVal) => {
            // check whether this key belongs to this heap
            if (!this.contains(key))
                return false;
            let idx = this.idxs.get(key);
            if (newVal === this.values[idx].val)
                return;
            if (newVal > this.values[idx].val)
                return this.increaseKey(key, newVal);
            if (newVal < this.values[idx].val)
                return this.decreaseKey(key, newVal);
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Removes the root (min),
        // Returns the root
        // Returns null if this heap is empty
        this.dequeue = () => {
            if (this.isEmpty())
                return null;
            if (this.size === 1) {
                this.size--;
                return this.values.pop();
            }
            const min = this.values[0];
            // replace the root with the last element
            this.values[0] = this.values.pop();
            this.size--;
            // delete from map
            this.idxs.delete(min.key);
            // update idx of the 'new root' in the map
            this.idxs.set(this.values[0].key, 0);
            // index of this node we have to rearrange and the idx of its children
            let idx = 0;
            let [lChild, rChild] = this.myChildrenIdx(idx);
            // bubble-down (while any child is smaller than the parent)
            while (this.lessThan(lChild, idx) || this.lessThan(rChild, idx)) {
                // update idx and its children
                idx = this.bubbleDown(idx, lChild, rChild);
                [lChild, rChild] = this.myChildrenIdx(idx);
            }
            return min;
        };
        // Removes the node from this respect key
        // Returns true
        // Returns false whether this key is not in this heap
        this.deleteKey = (key) => {
            if (!this.contains(key))
                return false;
            // if it is the last element of values: we dont need to rearrange
            if (this.idxs.get(key) === this.size - 1) {
                this.values.pop();
                this.idxs.delete(key);
                this.size--;
                return true;
            }
            //   get idx of this key
            let idx = this.idxs.get(key);
            // replace this node with the last one
            this.values[idx] = this.values.pop();
            this.size--;
            // delete from map
            this.idxs.delete(key);
            // update idx of the 'new node in idx position' in the map
            // we need to rearrange from idx to bellow
            // this.idxs[this.values[idx].key] = idx;
            this.idxs.set(this.values[idx].key, idx);
            // get the children of idx
            let [lChild, rChild] = this.myChildrenIdx(idx);
            // bubble-down (while any child is smaller than the parent)
            while (this.lessThan(lChild, idx) || this.lessThan(rChild, idx)) {
                // update idx and its children
                idx = this.bubbleDown(idx, lChild, rChild);
                [lChild, rChild] = this.myChildrenIdx(idx);
            }
            return true;
        };
        // To clear the heap instance and frees memory
        this.clear = () => {
            this.size = 0;
            while (!this.isEmpty())
                this.values.pop();
            for (let k of this.idxs)
                this.idxs.delete(k[0]);
        };
        this.values = [];
        // map: key to array idx => you say the key it returns the idx
        this.idxs = new Map();
        this.size = 0;
    }
}
export default MinHeap;
