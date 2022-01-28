// Unique Paths in a Grid II
// You are attempting to solve a Coding Contract. You have 10 tries remaining, after 
// which the contract will self-destruct.


// You are located in the top-left corner of the following grid:

// 0,1,0,1,0,0,0,0,0,0,
// 0,0,1,0,0,0,0,0,0,0,
// 0,0,0,0,0,0,0,0,1,0,
// 0,0,0,0,0,0,0,0,0,0,
// 0,0,1,1,0,0,0,0,0,0,

// You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step.
//  Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', 
//while empty spaces are denoted by 0.

// Determine how many unique paths there are from start to finish.

// NOTE: The data returned for this contract is an 2D array of numbers representing the grid.


const unique_paths_with_obstacles = (arr) => {
    let r = arr.length, c = arr[0].length;

    // create a 2D-matrix and initializing
    // with value 0
    let paths = new Array(r);
    for(let i = 0; i < r; i++)
    {
        paths[i] = new Array(c);
      for(let j = 0; j < c; j++)
      {
        paths[i][j] = 0;
      }
    }
  
    // Initializing the left corner if
    // no obstacle there
    if (arr[0][0] == 0)
      paths[0][0] = 1;
  
    // Initializing first column of
    // the 2D matrix
    for(let i = 1; i < r; i++)
    {
      // If not obstacle
      if (arr[i][0] == 0)
        paths[i][0] = paths[i - 1][0];
    }
  
    // Initializing first row of the 2D matrix
    for(let j = 1; j < c; j++)
    {
  
      // If not obstacle
      if (arr[0][j] == 0)
        paths[0][j] = paths[0][j - 1];
    } 
  
    for(let i = 1; i < r; i++)
    {
      for(let j = 1; j < c; j++)
      {
  
        // If current cell is not obstacle
        if (arr[i][j] == 0)
          paths[i][j] = paths[i - 1][j] +
          paths[i][j - 1];
      }
    }
  
    // Returning the corner value
    // of the matrix
    return paths[r - 1][paths[r - 1].length - 1];
};

var solution_array = [
    [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, ],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
    [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, ],
];

console.log(unique_paths_with_obstacles(solution_array));