// Given the following string containing only digits,
// return an array with all possible valid IP address combinations that can be created from the string:

//     10174106168

// Note that an octet cannot begin with a '0'
// unless the number itself is actually 0. For example, '192.168.010.1'
// is not a valid IP.

// Examples:

// 25525511135 - > [255.255 .11 .135, 255.255 .111 .35]
// 1938718066 - > [193.87 .180 .66]








// doesnt work yet





var solution_integer = 10174106168;

const octal_check = (buckets) => { // accepts an array of four-position potential IP addresses like [[111, 174, 30, 68],[11,117,430,68]]
    const uint8 = new Uint8ClampedArray(4);
    var solutions = [];

    for (let octals of buckets) { 
        let valid=[];

        let i = 0;
        do {
            uint8[i] = octals[i];           // store the proposed integer in a clamped 8-bit data structure
            if (uint8[i] == octals[i]) {   // if it comes out the same, then it was valid. if not, it overflowed or underflowed the buffer.
                valid.push(octals[i]);     // even a number like "017" will fail this test.
                i++;
            } else {
                break;
            }
        } while (i < 4);
        if (valid.length == 4) {
            solutions.push(octals);
        }
    }

    return solutions;
};

const final_string_check = (bucket, target) => {
    if (bucket.join("") == target) {
        return bucket.join(".");
    } else {
        return "";
    }

};

var solution_integer = 10174106168;


const powerset = (originalSet) => {
    const subSets = [];

    // We will have 2^n possible combinations (where n is a length of original set).
    // It is because for every element of original set we will decide whether to include
    // it or not (2 options for each set element).
    const numberOfCombinations = 2 ** originalSet.length;
  
    // Each number in binary representation in a range from 0 to 2^n does exactly what we need:
    // it shows by its bits (0 or 1) whether to include related element from the set or not.
    // For example, for the set {1, 2, 3} the binary number of 0b010 would mean that we need to
    // include only "2" to the current set.
    for (let combinationIndex = 0; combinationIndex < numberOfCombinations; combinationIndex += 1) {
      const subSet = [];
  
      for (let setElementIndex = 0; setElementIndex < originalSet.length; setElementIndex += 1) {
        // Decide whether we need to include current element into the subset or not.
        if (combinationIndex & (1 << setElementIndex)) {
          subSet.push(originalSet[setElementIndex]);
        }
      }
  
      // Add current subset to the list of all subsets.
      subSets.push(subSet);
    }
  
    return subSets;
};

const permutate = (int_arr) => {
    return int_arr.reduce(function (accumulator, current, idx, arr) {
            return [accumulator, current]
    });
    
}

const arrayify =  (stringed_int) => {
    return [...stringed_int.toString()];
};

console.log(permutate(arrayify(solution_integer)));

// let buckets = permutate(arrayify(solution_integer));
// let solutions = octal_check(buckets);
// for (let solution of solutions) {
//     let verified = final_string_check(solution, solution_integer);
//     console.log(verified);
// }




// var candidates = [];
// const uint8 = new Uint8ClampedArray(4);


// var arr = a.toString();
// var arr = [...arr];
// console.log(arr);
// var bucket = [];
// var solution = [];


// function *iterator(arr) {
//     let length = arr.length;
//     var octals;
//     // 12s
//     if (arr.length == 12) {
//         return [
//             arr.slice(0,3),
//             arr.slice(3,6),
//             arr.slice(6,9),
//             arr.slice(9,12)]
//         }
//     let distance_from = 12-length;
//     for (let i = 0; i < distance_from; ++i) {
//         console.log(i)
        
//         let a = 0
//         let b = 3
//         let c = 3
//         let d = 6
//         let e = 6 
//         let f = 9
//         let g = 9
//         let h = 12

        
//         const alphabet = [a,b,c,d,e,f,g];

//         for (let k = 0; k < alphabet.length; k++) {
//             Math.min(alphabet[k] + 1, arr.length)
//         }
//         for (let k = 0; k < alphabet.length; k++) {
//             Math.max(0, alphabet[k] -2)
//         }
        
//         yield [
//             arr.slice(a,b),
//             arr.slice(c,d),
//             arr.slice(e,f),
//             arr.slice(g,h)
//             ]
//         }
    

    


// }
// function get_split(arr){
//     var bucket = [];
//     var genny = iterator(arr);
//     var octals, done;

//     do {
//         ({octals, done} = genny.next());
//         if (octals) { bucket.push(octals); }
        
//     } while (!done);
    
//     for (let octals of bucket) {
//         // console.log(octals);
//         for (let o of octals) {
//             if (typeof o === "undefined") {
//                 o=2438;
//             }
//         }
//         uint8[0] = octals[0];
//         uint8[1] = octals[1];
//         uint8[2] = octals[2];
//         uint8[3] = octals[3];
//         if (uint8[0] == octals[0]) {
//             if (uint8[1] == octals[1]) {
//                 if (uint8[2] == octals[2]) {
//                     if (uint8[3] == octals[3]) {
//                         solution.push(octals);
//                     }
//                 }
//             }
//         }
//     }

// }
// var arr = a.toString();
// var arr = [...arr];
// get_split(arr)
// console.log(solution);



// const test = () => {
//     return [
//         [101, 74, 106, 168], 
//         [10,174,106,168],
//         [1,017,210,168], // should not return
//         [101,741,061,68] // should not return
//     ];
// };

// console.log(octal_check(test()));
// let solutions = octal_check(test());
// for (let s of solutions) {
//     console.log(final_string_check(s, solution_integer));
// }
