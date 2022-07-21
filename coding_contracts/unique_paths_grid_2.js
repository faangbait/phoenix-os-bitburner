// You are located in the top-left corner of the following grid:
// You are trying reach the bottom-right corner of the grid, but you can only
// move down or right on each step. Furthermore, there are obstacles on the grid
// that you cannot move onto. These obstacles are denoted by '1', while empty
// spaces are denoted by 0.
// Determine how many unique paths there are from start to finish.
// NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
export const UniquePathsGrid2 = {
    solve(params) {
        let r = params.length, c = params[0].length;
        // create a 2D-matrix and initializing
        // with value 0
        let paths = new Array(r);
        for (let i = 0; i < r; i++) {
            paths[i] = new Array(c);
            for (let j = 0; j < c; j++) {
                paths[i][j] = 0;
            }
        }
        // Initializing the left corner if
        // no obstacle there
        if (params[0][0] == 0)
            paths[0][0] = 1;
        // Initializing first column of
        // the 2D matrix
        for (let i = 1; i < r; i++) {
            // If not obstacle
            if (params[i][0] == 0)
                paths[i][0] = paths[i - 1][0];
        }
        // Initializing first row of the 2D matrix
        for (let j = 1; j < c; j++) {
            // If not obstacle
            if (params[0][j] == 0)
                paths[0][j] = paths[0][j - 1];
        }
        for (let i = 1; i < r; i++) {
            for (let j = 1; j < c; j++) {
                // If current cell is not obstacle
                if (params[i][j] == 0)
                    paths[i][j] = paths[i - 1][j] +
                        paths[i][j - 1];
            }
        }
        // Returning the corner value
        // of the matrix
        return paths[r - 1][paths[r - 1].length - 1];
    },
    tests(params) {
        [
            { params: [[0, 0, 0], [0, 1, 0], [0, 0, 0]], solution: 2 },
            { params: [[0, 1], [0, 0]], solution: 1 }
        ].forEach(t => {
            if (UniquePathsGrid2.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return UniquePathsGrid2.solve(params);
    },
    answer(params) { return UniquePathsGrid2.tests(params); }
};
