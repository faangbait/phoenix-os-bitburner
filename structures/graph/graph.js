import Queue from "structures/basics/queue";
import MinHeap from "structures/heaps/minHeap";
// import FibonacciHeap from "./heaps/fibonacciHeap";
// import FHNode from "./heaps/fHNode";
import ListSet from "structures/disjoint-sets/listSet";
import ForestSet from "structures/disjoint-sets/forestSet";
// Returns a random number between [min,max)
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
class Graph {
    constructor(directed = false) {
        this.directed = directed;
        //   **********************************************************
        //                            HELPERS
        //   **********************************************************
        // print this Graph
        //   FORMAT: <first vertex u> - <second vertex v> - <edge w>
        this.print = () => {
            for (let [u, vertexList] of this.list) {
                for (let v of vertexList) {
                    if (!this.directed) {
                        console.log(`${u} - ${v.node} - ${v.weight}`);
                    }
                    else {
                        console.log(`${u} -> ${v.node} - ${v.weight}`);
                    }
                }
            }
        };
        // Returns true if this list constains this vertex (key v)
        // Otherwise returns false
        this.contains = (v) => {
            if (this.list.get(v) === undefined)
                return false;
            return true;
        };
        // Returns true if v is a neighbour of u
        // otherwise returns false
        this.isNeighbour = (u, v) => {
            // check if u is already in this list
            if (!this.contains(u))
                return false;
            const vertexList = this.list.get(u);
            // if v is already in list[u] return true
            for (let i = 0; i < vertexList.length; i++) {
                if (vertexList[i].node === v)
                    return true;
            }
            return false;
        };
        // FOR karge min cut
        // Returns how many edges are between verteces u and v
        this.hme = (u, v) => {
            if (!this.contains(u))
                return false;
            const vertexList = this.list.get(u);
            let c = 0;
            for (let i = 0; i < vertexList.length; i++) {
                if (vertexList[i].node === v)
                    c++;
            }
            return c;
        };
        // FOR karge min cut
        // Returns the number of edges of this graph
        this.countEdges = () => {
            let c = 0;
            for (let [u, vertexList] of this.list) {
                for (let v of vertexList) {
                    c++;
                }
            }
            return c / 2;
        };
        // FOR karge min cut
        // Returns the key of two neighbours [u,v]
        this.pickRandomEdge = () => {
            const keys = [...this.list.keys()];
            const uIdx = random(0, keys.length);
            const u = keys[uIdx];
            const vertexList = this.list.get(u);
            const vIdx = random(0, vertexList.length);
            const v = vertexList[vIdx].node;
            return [u, v];
        };
        // FOR karge min cut
        // Merge two verteces into a single one
        this.mergeVerteces = (u, v) => {
            // adds all neighbours of v to u
            // and removes from v
            while (this.contains(v) && this.size > 2 && this.contains(u)) {
                const w = this.list.get(v)[0].node;
                // not allow self-loops
                if (w !== u) {
                    if (this.contains(w) && this.contains(u)) {
                        // we need to add (u,w) the same number of times that we remove (v,w)
                        const c = this.hme(v, w);
                        for (let i = 0; i < c; i++) {
                            this.addEdge(u, w);
                        }
                    }
                }
                this.removeEdge(v, w);
                // if v or w does not have any other neighbour remove it from this graph
                this.removeDegreeZero(v);
                this.removeDegreeZero(w);
            }
        };
        // Returns a new directed Graph with all edges of this reversed
        this.reverse = () => {
            // if this is not a directed graph returns false
            if (!this.directed)
                return false;
            const g = new Graph(true);
            for (let [u, vertexList] of this.list) {
                for (let v in vertexList) {
                    g.addVertecesAndEdge(vertexList[v].node, u, vertexList[v].weight);
                }
            }
            return g;
        };
        // returns a sort arr of edges {u: key of first vertex, v: key of second vertex, w: weight}
        //    Assumes Weighted Graph
        this.sortEdges = () => {
            const arr = [];
            for (let [u, vertexList] of this.list) {
                for (let v in vertexList) {
                    arr.push({
                        u: u,
                        v: vertexList[v].node,
                        w: vertexList[v].weight,
                    });
                }
            }
            const sortArr = arr.sort((a, b) => a.w - b.w);
            return sortArr;
        };
        // Test if T.union(u,v) creates a cycle
        this.hasCycles = (T, u, v) => {
            const uLeader = T.findSet(u);
            const vLeader = T.findSet(v);
            if (uLeader && vLeader && uLeader.key === vLeader.key) {
                return true;
            }
            return false;
        };
        // For Ford-Fulkerson
        // Returns boolean for an existing augmenting path, and the path between s -> t
        this.augmentingPath = (s, t, g) => {
            const { dist, parents } = g.bfs(s);
            const exists = dist.get(t) !== undefined ? true : false;
            if (!exists)
                return { exists: false, path: undefined };
            const path = this.getPath(s, t, parents);
            return { exists, path };
        };
        this.getPath = (s, t, parents) => {
            // go back from t until we reach s
            const path = [];
            let a = parents.get(t);
            path.push(t);
            while (a !== s) {
                path.push(a);
                a = parents.get(a);
            }
            path.push(s);
            return path.reverse();
        };
        // Returns the smallest capacity that remains in a path between s - t in a Net-Flow
        this.bottleneck = (path, g) => {
            let min = Infinity;
            // for each edge(u,v) of this path check the capacity that remains
            for (let i = 0; i < path.length - 1; i++) {
                const u = path[i];
                const v = path[i + 1];
                const list = g.list.get(u);
                // search for v in adj list of u
                for (let node of list) {
                    if (v === node.node) {
                        // check if edge(u,v) < min
                        if (min > node.weight) {
                            min = node.weight;
                        }
                    }
                }
            }
            return min;
        };
        // Returns the initial Residual Graph (Gr)
        //  with original edges, and residual edges with zero capacity
        this.createResidualGraph = () => {
            const rg = new Graph(true);
            for (let [u, vertexList] of this.list) {
                for (let v in vertexList) {
                    // original edge = c(u,v)
                    rg.addVertecesAndEdge(u, vertexList[v].node, vertexList[v].weight);
                    // residual edges
                    rg.addVertecesAndEdge(vertexList[v].node, u, 0);
                }
            }
            return rg;
        };
        // Update the edeges (orignal and residual) of Gr that are used in this path
        // using the bottleneck value
        this.updateResidualGraph = (g, path, bottleneck) => {
            // for each edge of this path
            for (let i = 0; i < path.length - 1; i++) {
                // nodes u,v from the edge (u,v)
                const u = path[i];
                const v = path[i + 1];
                // ajd list (capacity of each edge that remains) of u and v
                const listU = g.list.get(u);
                const listV = g.list.get(v);
                // values that will be updated
                let updatedEdgeUV;
                let updatedEdgeVU;
                // serach for v in adj list of u
                for (let i = 0; i < listU.length; i++) {
                    const t = listU[i];
                    if (v == t.node) {
                        // remove <bottleneck> from the remaining capacity of the edge (u,v)
                        updatedEdgeUV = {
                            node: t.node,
                            weight: t.weight - bottleneck,
                        };
                        // updated adj list of u and set in Gr's map
                        const updatedList = [...listU];
                        updatedList[i] = updatedEdgeUV;
                        g.list.set(u, updatedList);
                        break;
                    }
                }
                // search for u in the adj list of v
                for (let i = 0; i < listV.length; i++) {
                    const t = listV[i];
                    if (u == t.node) {
                        // add <bottleneck> from the remaining capacity of the edge (v,u)
                        // edges (u,v) and (v,u) are complementary, residual and original
                        updatedEdgeVU = {
                            node: t.node,
                            weight: t.weight + bottleneck,
                        };
                        // update adj list of v and set to Gr's map
                        const updatedList = [...listV];
                        updatedList[i] = updatedEdgeVU;
                        g.list.set(v, updatedList);
                        break;
                    }
                }
            }
            return g;
        };
        //   **********************************************************
        //                            INSERT
        //   **********************************************************
        // Adds an empty array to the new vertice v
        // Returns this list
        // If v is already in this list do nothing
        this.addVertex = (v) => {
            if (!this.list.get(v)) {
                this.list.set(v, []);
                this.size++;
                return this;
            }
            // if v is already in this list do nothing
            return this;
        };
        // adds v to neighbour list of u
        // ( and v to u neighbour list if it's a undirected graph )
        // O(1) - but dont check for duplications
        // DONT PASS DUPLICATES !
        this.addEdge = (u, v, weight = 0) => {
            if (!this.contains(u) || !this.contains(v))
                return false;
            let vertexList = this.list.get(u);
            vertexList.push({ node: v, weight });
            this.list.set(u, vertexList);
            if (!this.directed) {
                let vvl = this.list.get(v);
                vvl.push({ node: u, weight });
                this.list.set(v, vvl);
            }
            return this;
        };
        // adds v to neighbour list of u
        // ( and v to u neighbour list if it's a undirected graph )
        // kepp the min cost edge for duplications
        this.addEdgeNoDuplicates = (u, v, weight) => {
            if (!this.contains(u) || !this.contains(v))
                return false;
            const vertexList = this.list.get(u);
            // avoid duplications
            for (let neighbour in vertexList) {
                const z = vertexList[neighbour];
                // if already in list test to decrease with new edge
                if (v === z.node) {
                    if (weight < z.weight) {
                        vertexList[neighbour].weight = weight;
                        this.list.set(u, vertexList);
                    }
                    return this;
                }
            }
            vertexList.push({ node: v, weight });
            this.list.set(u, vertexList);
            return this;
        };
        // Adds both u and v verteces and their edge w
        this.addVertecesAndEdge = (u, v, w = 1, d = true) => {
            this.addVertex(u);
            this.addVertex(v);
            if (d) {
                this.addEdge(u, v, w);
            }
            else {
                this.addEdgeNoDuplicates(u, v, w);
            }
        };
        //   **********************************************************
        //                            DELETE
        //   **********************************************************
        // Removes v from neighbour list of u (and v from u neighbour list if undirected)
        // Returns this list
        this.removeEdge = (u, v) => {
            if (!this.contains(u) || !this.contains(v))
                return false;
            let vertexList = this.list.get(u);
            vertexList = vertexList.filter((w) => w.node !== v);
            if (!this.directed) {
                // vertex list of v
                let vvl = this.list.get(v);
                vvl = vvl.filter((w) => w.node !== u);
                this.list.set(v, vvl);
            }
            this.list.set(u, vertexList);
            return this;
        };
        // Removes all edges of v and v itself
        //  Returns this list
        this.removeVertex = (v) => {
            if (!this.contains(v))
                return false;
            const vertexList = this.list.get(v);
            while (vertexList.length) {
                const u = vertexList.pop();
                this.removeEdge(u.node, v);
            }
            this.list.delete(v);
            this.size--;
            return this;
        };
        // If u does not have any neighbour, iow has degree zero
        // Removes u
        // Returns this graph
        // Returns false if u is not in this graph
        this.removeDegreeZero = (u) => {
            if (!this.contains(u))
                return false;
            const vertexList = this.list.get(u);
            if (vertexList.length === 0) {
                // if v was the only neighbour of v (the adj list of u is now empty)
                // removes u
                this.removeVertex(u);
            }
            return this;
        };
        // TODO: direcyed weighted: u -> v cost
        //   **********************************************************
        //                            ALGORITHMS
        //   **********************************************************
        // Returns a min cut
        // We need to execute a sufficient number of times to have a high prob to find the min cut
        this.kargerMinCut = () => {
            while (this.size > 2) {
                // pick a random edge
                const [u, v] = this.pickRandomEdge();
                // contract randomly edges (u,v) until only two verteces remain
                this.mergeVerteces(u, v);
            }
            return this.countEdges();
        };
        // Returns: a list of all verteces found (in the order of dequeue)
        //    the parent of each visited vertex
        //    the distance from s to each visited vertex
        //    all visited verteces
        this.bfs = (s) => {
            // the order of each vertex is dequeue (Array of Keys)
            const result = new Array();
            // Maps the key of each vertex to its distance from vertex s
            const dist = new Map();
            // Maps the key of each vertex to its parents key
            const parents = new Map();
            const visited = new Map();
            const q = new Queue();
            // add s to the queue
            q.enQueue(s);
            // mark s as visited
            visited.set(s, true);
            dist.set(s, 0);
            parents.set(s, null);
            let v;
            while (q.size !== 0) {
                v = q.deQueue();
                result.push(v.key);
                this.list.get(v.key).forEach((u) => {
                    // if u unvisited
                    if (!visited.get(u.node) && u.weight > 0) {
                        // mark u as visited
                        visited.set(u.node, true);
                        // add u to the queue
                        q.enQueue(u.node);
                        parents.set(u.node, v.key);
                        dist.set(u.node, dist.get(v.key) + 1);
                    }
                });
            }
            return { result, parents, dist, visited };
        };
        // Returns a list with all connected components of G
        this.undirectConnectivity = () => {
            const components = new Array();
            const isVisited = new Map();
            // a single component after to execute one bfs
            for (let [u] of this.list) {
                // check if node u was already visited before
                if (!isVisited.get(u)) {
                    const { result, visited } = this.bfs(u);
                    // updtade visited nodes after this bfs
                    visited.forEach((value, key) => {
                        isVisited.set(key, value);
                    });
                    // add this new result
                    components.push(result);
                }
            }
            return components;
        };
        // dfs recursive
        this.dfs = (s, 
        // white: unvisited node (not used in this implementation)
        // first time we see a node it is not in the map
        // gray: visited node, but not finish (all neighbours also visited)
        // black: finished node
        color = new Map(), labeledOrder = new Map(), finish = new Array(), parents = new Map(), cycle = false) => {
            //  mark s as visited
            color.set(s, "gray");
            // for every edge of s
            this.list.get(s).forEach((u) => {
                if (!color.get(u.node)) {
                    // set u as a child of s
                    parents.set(u.node, s);
                    // recursive call
                    this.dfs(u.node, color, labeledOrder, finish, parents, cycle);
                }
                else if (color.get(u.node) === "gray") {
                    // back edge:
                    // u is an ancestor of s (i.e., there is some path u -> s, and now we found an edge s -> u)
                    // forming a cycle
                    cycle = true;
                }
            });
            // all neighbours visited => finished!
            labeledOrder.set(s, this.currentLabel);
            color.set(s, "black");
            this.currentLabel--;
            finish.push(s);
            return {
                labeledOrder,
                color,
                finish,
                parents,
                cycle,
            };
        };
        // Returns the size of each Strong Component
        // the id of each SC is its Leader
        this.kosaraju = () => {
            // reverse G
            const gRerv = this.reverse();
            // finish order
            if (gRerv === false)
                return false;
            const { finish } = gRerv.topologicalSort();
            const color = new Map();
            // the vertex who calls dfs (maps leader's vertex key to the size of the Strong Component)
            const leader = new Map();
            let u, r;
            // for (let i = 0; i < finish.length; i++) {
            for (let i = finish.length - 1; i > 0; i--) {
                u = finish[i];
                if (!color.get(u)) {
                    // r = this.dfs(u);
                    r = this.dfs(u, color);
                    // update visited
                    r.color.forEach((value, key) => {
                        color.set(key, value);
                    });
                    // all verteces visited have u as leader
                    leader.set(u, r.finish.length);
                }
            }
            return leader;
        };
        // TODO: USE FIBONACCI HEAP (DECREASE KEY)
        // Returns the distance from s to each vertex, their parents, and the number of dequeues
        this.dijkstra = (s) => {
            const heap = new MinHeap();
            // to count how many dequeues from heap are made
            // using decrease key will push and dequeue only one time each node
            let dequeues = 0;
            const distances = new Map();
            const parents = new Map();
            let smallest;
            for (let [vertex] of this.list) {
                if (vertex !== s) {
                    distances.set(vertex, Infinity);
                }
            }
            distances.set(s, 0);
            heap.enqueue(s, 0);
            parents.set(s, null);
            let deacrease = false;
            // while we have nodes to visite:
            while (!heap.isEmpty()) {
                smallest = heap.dequeue().key;
                dequeues++;
                // while heap is not empty: smallest will exist and
                // we always will add reachable nodes (i.e. dist < Inf)
                const vertexList = this.list.get(smallest);
                for (let neighbour in vertexList) {
                    let nextNode = vertexList[neighbour];
                    // calculate Dijkstra's  Greedy Criterium
                    let d = distances.get(smallest) + nextNode.weight;
                    //   compare distance calculated with last distance storaged
                    if (d < distances.get(nextNode.node)) {
                        //   updating distances and parents
                        distances.set(nextNode.node, d);
                        parents.set(nextNode.node, smallest);
                        // try to deacrease key
                        deacrease = heap.decreaseKey(nextNode.node, d);
                        // if this node is not in heap(wasn't decrease) add to the Heap
                        if (deacrease === false) {
                            heap.enqueue(nextNode.node, d);
                        }
                    }
                }
            }
            return { distances, parents, dequeues };
        };
        // Returns the distance from s to each vertex and their parents O(mn)
        // negative costs are allowed
        // SSSP (Single Source Shortest Problem)
        // detect negative cycles: boolean output (cycle)
        // use parents (predecessor pointers) to traverse the path
        this.bellmanFord = (s) => {
            // O(m) space => to reconstruct path from s to (any) v
            // use parents map (predecessor pointers)
            const costs = new Map();
            // predecessor pointers
            const parents = new Map();
            // to stop earlier
            let stop = true;
            // i: number of edges allowed
            // for i =0, all dist from s to vertex are infinity
            for (let [vertex] of this.list) {
                if (vertex !== s) {
                    costs.set(vertex, Infinity);
                }
            }
            // dist s to s
            costs.set(s, 0);
            parents.set(s, null);
            // i edges allowed, (n-1) at most => O(n)
            // try for n edges to check for negative cycles
            // if costs get smaller indefinitely (OPT(n,v) !== OPT(n-1,v))
            // There is a negative cycle
            for (let i = 1; i < this.size + 1; i++) {
                // if any distance get smaller, we can stop early
                // if after n-1 steps: the costs still get smaller (with n edges allowed)
                // negative cycle detected!
                stop = true;
                // try a min path for each edge => O(m)
                for (let [v, vertexList] of this.list) {
                    // only try for costs that can be decreased
                    if (costs.get(v) === Infinity) {
                        continue;
                    }
                    for (let neighbour in vertexList) {
                        const w = vertexList[neighbour];
                        const d = costs.get(v) + w.weight;
                        if (costs.get(w.node) > d) {
                            costs.set(w.node, d);
                            parents.set(w.node, v);
                            // still getting costs update => dont stop!
                            stop = false;
                        }
                    }
                }
                if (stop)
                    break;
            }
            return { costs, parents, cycle: !stop };
        };
        // Returns the distance from all pair of vertices (u,v) in V
        // negative costs are allowed
        // APSP (All Pairs Shortest Path)
        // use parents (predecessor pointers) to traverse the cycle
        // Also returns the last node used in set K
        this.floydWarshall = () => {
            let costs = new Map();
            // predecessor pointers
            const parents = new Map();
            const keys = [...this.list.keys()];
            // last vertex in K
            let oldK = keys[0];
            // Initialize maps
            // i: starter vertex, j: target vertex
            // K: set of allowed vertex, k: last vertex in K
            // K = {"0", "a", "1", ... k}
            // if i === j  costs[i][j][0] = 0
            // if i !== j costs[i][j][0] = Infinity
            // O(n2)
            for (let [i] of this.list) {
                for (let [j] of this.list) {
                    if (!costs.get(i)) {
                        costs.set(i, new Map());
                        parents.set(i, new Map());
                    }
                    if (!costs.get(i).get(j)) {
                        costs.get(i).set(j, new Map());
                    }
                    if (i === j) {
                        costs.get(i).get(j).set(oldK, 0);
                        parents.get(i).set(i, null);
                    }
                    else {
                        costs.get(i).get(j).set(oldK, Infinity);
                    }
                }
            }
            // update neighbour distances
            // O(m)
            for (let [i, vertexList] of this.list) {
                for (let neighbour in vertexList) {
                    const w = vertexList[neighbour];
                    costs.get(i).get(w.node).set(oldK, w.weight);
                }
            }
            // to expand K to the next vertex of this.list
            //  O(n3)
            for (let k of keys) {
                for (let [i] of this.list) {
                    for (let [j] of this.list) {
                        // min {path without new k (as intermediary), path i to k + path k to j}
                        const lastD = costs.get(i).get(j).get(oldK);
                        const d = costs.get(i).get(k).get(oldK) + costs.get(k).get(j).get(oldK);
                        if (d < lastD) {
                            costs.get(i).get(j).set(k, d);
                            parents.get(i).set(j, k);
                        }
                        else {
                            costs.get(i).get(j).set(k, lastD);
                        }
                    }
                }
                // update oldK
                oldK = k;
            }
            return { costs, parents, oldK };
        };
        // Returns the distance from all pair of vertices (u,v) in V
        // negative costs are allowed
        // Report a negative Cycle (cycle: true)
        // APSP (All Pairs Shortest Path)
        // use parents (predecessor pointers) to traverse the cycle
        //  O(mnlog(n))
        this.johnson = (s) => {
            // map distance between vertex u to v
            const dist = new Map();
            // map parent of v when u is the start vertex
            const par = new Map();
            // Form G': equal to G, only add vertex <s>
            const newG = new Graph(true);
            // O(m)
            for (let [u, vertexList] of this.list) {
                for (let v of vertexList) {
                    newG.addVertecesAndEdge(u, v.node, v.weight);
                }
            }
            // Add a new vertex <s> connect to all v in G, with edge cost = 0
            // O(n)
            newG.addVertex(s);
            for (let [v] of this.list) {
                if (s !== v)
                    newG.addEdge(s, v, 0);
            }
            // runs BF in G' using <s> as start vertex
            // BF: O(mn)
            const { costs, cycle } = newG.bellmanFord(s);
            // check for a negative cycle
            if (cycle)
                return { cycle: true };
            // calcule ce' = ce + pu - pv
            // pu and pv are the costs from BF for a pair (u,v) of vertex
            // O(m)
            for (let [u, vertexList] of this.list) {
                for (let v of vertexList) {
                    const newCost = v.weight + costs.get(u) - costs.get(v.node);
                    v.weight = newCost;
                    this.list.set(u, vertexList);
                }
            }
            // run dijkstra for each vertex (using ce')
            // ce' is not negative, but dijkstra will retun: d'(u,v)
            // d'(u,v) = d(u,v) + pu - pv
            // Dijkstra n times: O(nmlog(n))
            for (let [u] of this.list) {
                const { distances, parents } = this.dijkstra(u);
                dist.set(u, distances);
                par.set(u, parents);
            }
            // we nedd to calculate d(u,v)
            // d(u,v) = d'(u,v) - pu + pv
            // O(n2)
            for (let [u] of this.list) {
                for (let [v] of this.list) {
                    if (u !== v) {
                        const d = dist.get(u).get(v);
                        const pu = costs.get(u);
                        const pv = costs.get(v);
                        dist.get(u).set(v, d - pu + pv);
                    }
                }
            }
            return { costs: dist, parents: par, cycle };
        };
        // TODO: USE FIBONACCI HEAP (DECREASE KEY)
        // Returns the MST and its cost
        this.prim = (s) => {
            const heap = new MinHeap();
            const mst = new Graph();
            // map to keep track what element is already in mst
            // we dont need this in Dijkstra because dist always encrease
            const mstSet = new Map();
            const edgeCost = new Map();
            const parents = new Map();
            // sum of each MST's edge
            let cost = 0;
            let dequeues = 0;
            let smallest;
            let deacrease = false;
            for (let [vertex] of this.list) {
                if (vertex !== s) {
                    edgeCost.set(vertex, Infinity);
                    mstSet.set(vertex, false);
                }
            }
            // setting start node
            edgeCost.set(s, 0);
            heap.enqueue(s, 0);
            // heap.buildHeap(edgeCost);
            parents.set(s, null);
            mstSet.set(s, true);
            while (!heap.isEmpty()) {
                smallest = heap.dequeue().key;
                dequeues++;
                //   we found the min cost to add smallest in our MST
                cost += edgeCost.get(smallest);
                mst.addVertex(smallest);
                mstSet.set(smallest, true);
                if (parents.get(smallest)) {
                    //   if smallest has a parent (is not the start node) add the edge to mst
                    mst.addEdge(smallest, parents.get(smallest), edgeCost.get(smallest));
                }
                if (smallest || edgeCost.get(smallest) !== Infinity) {
                    const vertexList = this.list.get(smallest);
                    for (let neighbour in vertexList) {
                        let nextNode = vertexList[neighbour];
                        // compare the cost of this edge with the last one storaged
                        //   and check if this node is already in mstSet
                        if (nextNode.weight < edgeCost.get(nextNode.node) &&
                            !mstSet.get(nextNode.node)) {
                            //   updating edgeCost and parents
                            edgeCost.set(nextNode.node, nextNode.weight);
                            parents.set(nextNode.node, smallest);
                            // try to deacrease key
                            deacrease = heap.decreaseKey(nextNode.node, nextNode.weight);
                            // if this node is not in heap(wasn't decrease) add to the Heap
                            if (deacrease === false) {
                                heap.enqueue(nextNode.node, nextNode.weight);
                            }
                        }
                    }
                }
            }
            console.log(`dequeues: ${dequeues},size: ${this.size}, h.size: ${heap.size}`);
            return { cost, mst };
        };
        // Returns the cost and MST
        // if k=== true
        //    Single-link Clustering
        //    return the cost of the very next edge which will not create a cycle.
        //    USE List Set => f=false
        this.kruskal = (f = true, k) => {
            const sortEdges = this.sortEdges();
            const T = f ? new ForestSet() : new ListSet();
            for (let [u] of this.list)
                T.makeSet(u);
            const MST = new Graph();
            let cost = 0;
            for (let i = 0; i < sortEdges.length; i++) {
                let { u, v, w } = sortEdges[i];
                if (!this.hasCycles(T, u, v)) {
                    T.union(u, v);
                    MST.addVertecesAndEdge(u, v, w);
                    cost += w;
                    if (k) {
                        if (T instanceof ListSet) {
                            if (T.lists.size === k - 1) {
                                return { w };
                                break;
                            }
                        }
                        else {
                            console.log("Please use List Set. f = false");
                            throw "use List Set. f=false";
                        }
                    }
                }
            }
            return { cost, MST };
        };
        // Returns the final Residual Graph
        this.fordFulkerson = (s, t) => {
            // Net flow must be a directed graph
            if (!this.directed)
                return false;
            const flow = new Map();
            // Initially f(e)=0
            // for each edge(u,v) of G f(e) = 0
            for (let [u, vertexList] of this.list) {
                flow.set(u, new Map());
                for (let v of vertexList) {
                    flow.get(u).set(v.node, 0);
                }
            }
            let residualGraph = this.createResidualGraph();
            let { exists, path } = this.augmentingPath(s, t, residualGraph);
            // if there is no path between s - t return false
            if (!exists || !path)
                return false;
            // min val of flow that still can pass through
            const bottleneck = this.bottleneck(path, residualGraph);
            // while exists a path do augmenting path in Gr
            while (exists) {
                const bottleneck = this.bottleneck(path, residualGraph);
                residualGraph = this.updateResidualGraph(residualGraph, path, bottleneck);
                const ap = this.augmentingPath(s, t, residualGraph);
                exists = ap.exists;
                path = ap.path;
            }
            return residualGraph;
        };
        this.list = new Map();
        this.currentLabel = null;
        this.size = 0;
    }
    // Returns the labeled order and finish order
    // Does not work for cycled graphs, only DAGs
    topologicalSort() {
        const labeledOrder = new Map();
        const color = new Map();
        const finish = new Array();
        // to keep track of ordering
        this.currentLabel = this.list.size;
        for (let [u] of this.list) {
            if (!color.get(u)) {
                const r = this.dfs(u);
                // update values
                r.color.forEach((value, key) => {
                    color.set(key, value);
                });
                r.labeledOrder.forEach((value, key) => {
                    labeledOrder.set(key, value);
                });
                finish.push(...r.finish);
            }
        }
        return { labeledOrder, finish };
    }
}
//   **********************************************************
//                            CREATING
//   **********************************************************
// Add all verteces and edges to this graph from a file
// File is the adj list of this Graph
// FORMAT: <first vertex u>' '<second vertex v>' ' <edge w>
Graph.create = (ns, file) => {
    const g = new Graph();
    // const data = fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    const data = ns.read(file);
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "\n") {
            line += data[i];
        }
        else {
            split = line.trim().split(" ");
            g.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
            line = "";
        }
    }
    // check if the last line is empty
    if (line !== "") {
        split = line.trim().split(" ");
        g.addVertecesAndEdge(split[0], split[1], parseInt(split[2]));
    }
    return g;
};
// Add all verteces and edges to this graph from a file
// File is the adj list of this Graph
// FORMAT: <vertex u>' => neighbours: '<vertex v>' ... '<vertex n>'
// This format allow duplicate edges, we need to handle
Graph.createListAdj = (ns, file) => {
    const g = new Graph();
    const data = ns.read(file);
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "\n") {
            line += data[i];
        }
        else {
            split = line.trim().split(" ");
            const u = split[0];
            while (split.length > 1) {
                const v = split.pop();
                // to avoid duplicate edges
                if (!g.isNeighbour(u, v)) {
                    // whether v is not neighbour of u
                    g.addVertecesAndEdge(u, v);
                }
            }
            line = "";
        }
    }
    // check if the last line is empty
    if (line !== "") {
        split = line.trim().split(" ");
        const u = split[0];
        while (split.length > 1) {
            const v = split.pop();
            // to avoid duplicate edges
            if (!g.isNeighbour(u, v)) {
                // whether v is not neighbour of u
                g.addVertecesAndEdge(u, v);
            }
        }
    }
    return g;
};
// Add all verteces and edges to this graph from a file
// File is the adj list of this Graph
// FORMAT: <vertex u>' => neighbours: '<vertex v>,weight' ... '<vertex n>,weight'
// This format allow duplicate edges, we need to handle
Graph.createListAdjWeighted = (ns, file) => {
    const g = new Graph();
    const data = ns.read(file);
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "\n") {
            line += data[i];
        }
        else {
            split = line.trim().split("	");
            const u = split[0];
            while (split.length > 1) {
                const t = split.pop();
                const v = t.split(",");
                // to avoid duplicate edges
                if (!g.isNeighbour(u, v[0])) {
                    // whether v is not neighbour of u
                    g.addVertecesAndEdge(u, v[0], parseInt(v[1]));
                }
            }
            line = "";
        }
    }
    // check if the last line is empty
    if (line !== "") {
        split = line.trim().split("	");
        const u = split[0];
        while (split.length > 1) {
            const t = split.pop();
            const v = t.split(",");
            // to avoid duplicate edges
            if (!g.isNeighbour(u, v[0])) {
                // whether v is not neighbour of u
                g.addVertecesAndEdge(u, v[0], parseInt(v[1]));
            }
        }
    }
    return g;
};
// Add all verteces and edges to this graph from a file
// File is the adj list of this Graph
// FORMAT: <first vertex u>' '<second vertex v>
// it is a drirected graph, the edge goes from u to v, i.e.: u -> v
// d to allow duplication
Graph.createDirected = (ns, file, w = false, d = false) => {
    // set this graph as directed
    const g = new Graph(true);
    const data = ns.read(file);
    let line = "";
    let split = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== "\n") {
            line += data[i];
        }
        else {
            split = line.trim().split(" ");
            if (!w) {
                g.addVertecesAndEdge(split[0], split[1], 1, d);
            }
            else {
                g.addVertecesAndEdge(split[0], split[1], parseInt(split[2]), d);
            }
            line = "";
        }
    }
    // check if the last line is empty
    if (line !== "") {
        split = line.trim().split(" ");
        if (!w) {
            g.addVertecesAndEdge(split[0], split[1], 1, d);
        }
        else {
            g.addVertecesAndEdge(split[0], split[1], parseInt(split[2]), d);
        }
    }
    return g;
};
export default Graph;
