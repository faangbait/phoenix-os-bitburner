// You are located in the top-left corner of the following grid:
// You are trying to find the shortest path to the bottom-right corner of the grid,
// but there are obstacles on the grid that you cannot move onto.
// These obstacles are denoted by '1', while empty spaces are denoted by 0.
// Determine the shortest path from start to finish, if one exists.
// The answer should be given as a string of UDLR characters, indicating the moves along the path
// NOTE: If there are multiple equally short paths, any of them is accepted as answer.
// If there is no path, the answer should be an empty string.
// NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
export const ShortestPathGrid = {
    solve(params) {
        const dist = params.map(arr => new Array(arr.length).fill(Infinity));
        const prev = params.map(arr => new Array(arr.length).fill(undefined));
        const path = params.map(arr => new Array(arr.length).fill(undefined));
        const queue = [];
        params.forEach((arr, i) => arr.forEach((a, j) => {
            if (a === 0)
                queue.push([i, j]);
        }));
        dist[0][0] = 0;
        const height = params.length;
        const length = params[height - 1].length;
        const target = [height - 1, length - 1];
        while (queue.length > 0) {
            let u;
            let d = Infinity;
            let idx;
            queue.forEach(([i, j], k) => {
                if (dist[i][j] < d) {
                    u = [i, j];
                    d = dist[i][j];
                    idx = k;
                }
            });
            if (JSON.stringify(u) === JSON.stringify(target)) {
                let str = '';
                let [a, b] = target;
                if (prev[a][b] || (a === 0 && b === 0)) {
                    while (prev[a][b]) {
                        str = path[a][b] + str;
                        [a, b] = prev[a][b];
                    }
                }
                return str;
            }
            queue.splice(idx, 1);
            if (u === undefined)
                continue;
            const [a, b] = u;
            for (const [s, i, j] of [['D', a + 1, b], ['U', a - 1, b], ['R', a, b + 1], ['L', a, b - 1]]) {
                if (i < 0 || i >= height || j < 0 || j >= length)
                    continue; // Index over edge
                if (params[i][j] === 1)
                    continue; // We've hit a wall;
                if (!queue.some(([k, l]) => k === i && l === j))
                    continue; // Vertex not in queue
                const alt = dist[a][b] + 1;
                if (alt < dist[i][j]) {
                    dist[i][j] = alt;
                    prev[i][j] = u;
                    path[i][j] = s;
                }
            }
        }
        return '';
    },
    tests(params) {
        [
            { params: [[0, 0], [1, 0]], solution: "RD" }, // TODO
        ].forEach(t => {
            if (ShortestPathGrid.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return ShortestPathGrid.solve(params);
    },
    answer(params) { return ShortestPathGrid.tests(params); }
};
