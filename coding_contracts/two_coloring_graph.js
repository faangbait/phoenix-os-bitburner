// You are given the following data, representing a graph:
// Note that "graph", as used here, refers to the field of graph theory, and has
// no relation to statistics or plotting.
// The first element of the data represents the number of vertices in the graph.
// Each vertex is a unique number between 0 and ${data[0] - 1}.
// The next element of the data represents the edges of the graph.
// Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v].
// Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.
// You must construct a 2-coloring of the graph, meaning that you have to assign each
// vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have
// the same color. Submit your answer in the form of an array, where element i
// represents the color of vertex i. If it is impossible to construct a 2-coloring of
// the given graph, instead submit an empty array.
export const TwoColoringGraph = {
    solve(params) {
        const neighbors = (data, vertex) => {
            const adjLeft = data[1].filter(([a, _]) => a === vertex).map(([_, b]) => b);
            const adjRight = data[1].filter(([_, b]) => b === vertex).map(([a, _]) => a);
            return adjLeft.concat(adjRight);
        };
        // Set up array to hold colors
        const coloring = Array(params[0]).fill(undefined);
        // Keep looping on undefined vertices if graph is disconnected
        while (coloring.some(e => e === undefined)) {
            // Color a vertex in the graph
            const initialVertex = coloring.findIndex(e => e === undefined);
            coloring[initialVertex] = 0;
            const frontier = [initialVertex];
            // Propagate the coloring throughout the component containing v greedily
            while (frontier.length > 0) {
                const v = frontier.pop();
                for (const u of neighbors(params, v)) {
                    if (coloring[u] === undefined) {
                        coloring[u] = coloring[v] ^ 1; // Set the color of u to the opposite of the color of v
                        frontier.push(u); // Check u next
                    }
                    // Assert that u and v do not have the same color if they are already colored
                    else if (coloring[u] === coloring[v])
                        return "[]";
                }
            }
        }
        return coloring;
    },
    arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    },
    tests(params) {
        // [
        //     { params: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]], solution: [0, 0, 1, 1] },
        //     { params: [3, [[0, 1], [0, 2], [1, 2]]], solution: "[]" }
        // ].forEach(t => {
        //     if (!TwoColoringGraph.arrayEquals(TwoColoringGraph.solve(t.params as [number, [number, number][]]), t.solution)) { throw "Test failed to pass" }
        // })
        return TwoColoringGraph.solve(params);
    },
    answer(params) { return TwoColoringGraph.tests(params); }
};
