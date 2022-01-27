function minSumPath(arr) {

    // For storing the result
    // in a 1-D array, and
    // simultaneously updating
    // the result.
    let memo = [];
    let n = arr.length - 1;

    // For the bottom row
    for (let i = 0; i < arr[n].length; i++)
        memo[i] = arr[n][i];

    // Calculation of the
    // remaining rows, in
    // bottom up manner.
    for (let i = arr.length - 2; i >= 0; i--)
        for (let j = 0; j < arr[i].length; j++)
            memo[j] = arr[i][j] +
            Math.min(memo[j],
                memo[j + 1]);

    // Return the
    // top element
    return memo[0];
}

console.log(minSumPath([
    [3],
   [9,3],
  [4,4,9],
 [1,2,2,7],
[8,8,9,1,9],
[9,4,4,1,4,6],
[3,6,4,5,1,3,2],
[6,9,3,3,4,8,6,6],
[5,7,6,8,4,1,4,9,5],
[8,5,9,2,7,9,3,8,1,7],
[5,3,6,2,2,4,6,3,9,5,8]
]))