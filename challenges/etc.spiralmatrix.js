// Given a two dimensional matrix of arrays, spiralize them.
// var matrix= [
//         [1,  2,  3,  4],
//         [5,  6,  7,  8],
//         [9, 10, 11, 12]
//     ];

// Answer: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]

// var matrix = [ 
//     [1, 2, 3],
//     [4, 5, 6],
//     [7, 8, 9]
// ];

// Answer: 1, 2, 3, 6, 9, 8, 7, 4, 5

var matrix = 
[
    [47,42,14,23,27, 4, 3,49],
    [ 7,44,39,44,30,33,40,39],
    [32, 4,33,28,11, 6,36, 1],
    [15,21,44, 1,10,50,40, 5],
    [47,47, 5,16, 6,33,46,28],
    [23,30,10, 5, 8,36, 4,48],
    [27,15,15, 7,45, 2,40,48],
    [38,25,47,41,17,13,22,34]
];

const spiralize_matrix = (matrix) => {
    var result = [];
    while (matrix.length > 0) {
        result.push(...matrix.shift());
        try {
            matrix = matrix[0].map((val, idx) => matrix.map(row => row[idx]).reverse()); // i only know how to rotate clockwise
            matrix = matrix[0].map((val, idx) => matrix.map(row => row[idx]).reverse()); // this solution wants it counterclockwise
            matrix = matrix[0].map((val, idx) => matrix.map(row => row[idx]).reverse()); // but three clockwise rotations is counter clockwise!
        } catch(e) {
            result.push(...matrix);
        }
    }
    return result;
};

console.log("[" + spiralize_matrix(matrix).join(", ") + "]");
