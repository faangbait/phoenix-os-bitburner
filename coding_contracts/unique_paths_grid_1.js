// You are in a grid with
// ${numRows} rows and ${numColumns} columns, and you are
// positioned in the top-left corner of that grid. You are trying to
// reach the bottom-right corner of the grid, but you can only
// move down or right on each step. Determine how many
// unique paths there are from start to finish.
export const UniquePathsGrid1 = {
    solve(params) {
        let arr = new Array(params[0]).fill(new Array(params[1]).fill(0));
        let r = arr.length, c = arr[0].length;
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
        if (arr[0][0] == 0)
            paths[0][0] = 1;
        // Initializing first column of
        // the 2D matrix
        for (let i = 1; i < r; i++) {
            // If not obstacle
            if (arr[i][0] == 0)
                paths[i][0] = paths[i - 1][0];
        }
        // Initializing first row of the 2D matrix
        for (let j = 1; j < c; j++) {
            // If not obstacle
            if (arr[0][j] == 0)
                paths[0][j] = paths[0][j - 1];
        }
        for (let i = 1; i < r; i++) {
            for (let j = 1; j < c; j++) {
                // If current cell is not obstacle
                if (arr[i][j] == 0)
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
            { params: [3, 7], solution: 28 },
            { params: [3, 2], solution: 3 }
        ].forEach(t => {
            if (UniquePathsGrid1.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return UniquePathsGrid1.solve(params);
    },
    answer(params) { return UniquePathsGrid1.tests(params); }
};
