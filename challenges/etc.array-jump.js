// You are attempting to solve a Coding Contract. You have 1 tries remaining, after which the contract will self-destruct.
// You are given the following array of integers:

// 9,2,8,10,2,4,0,6,0

// Each element in the array represents your MAXIMUM jump length at that position. 
// This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.
// Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

// Your answer should be submitted as 1 or 0, representing true and false respectively

let solution_array= [3,0,2,0,1,3,6,0,5,7,0,0,0,0,5,0,1,1,0,9];

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

const array_jumping_generate_graph = (solution_array) => {
    let graph = new Map();
    for (i = 0; i < solution_array.length; i++) {
        graph.set(i, range(solution_array[i], i+1)
        );
    }
    return graph;
};

const array_jumping_traverse_graph = (graph, source) => {
    const stack = [ source ];
    const result = [];
    const visited = {};
    visited [ source ] = true;
    let current;

    while (stack.length > 0) {
        current = stack.pop();
        // console.log(current);
        if (current >= graph.size) { return true; }
        result.push(current);
        try {
            graph.get(current).forEach(neighbor => {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                }
            });
        } catch (e) {
            console.log(e);
            return true;
        }
    }
    return false;
};
    

array_jumping_can_win = (solution_array) => {
    let graph = array_jumping_generate_graph(solution_array);
    return array_jumping_traverse_graph(graph, 0);
};

