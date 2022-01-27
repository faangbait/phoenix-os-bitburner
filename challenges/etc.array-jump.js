// You are attempting to solve a Coding Contract. You have 1 tries remaining, after which the contract will self-destruct.
// You are given the following array of integers:

// 9,2,8,10,2,4,0,6,0

// Each element in the array represents your MAXIMUM jump length at that position. 
// This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.
// Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

// Your answer should be submitted as 1 or 0, representing true and false respectively


/**
 *
 *
 * @param {[number]} array
 * @param {number} position
 * @param {number} length
 * @return {*} 
 */
const can_win = (array, position, length) => {
    if (position+length > array.length) { return true; }

    // console.log("--------------")
    // console.log("position: " + position);
    // console.log("array: " + array);
    // console.log("dist: " + length);
    let legal_lands = array.slice(position+1, position+length+1);

    console.log("legal lands: " + legal_lands);

    for (let idx = 0; idx <= legal_lands.length; idx++) {
        if (legal_lands[idx] > 0) {
            // console.log("trying " + legal_lands[idx])
            return can_win(array, array[position], legal_lands[idx]);
        }
    }
    return false;
};

let solution_array= [9,2,8,10,2,4,0,6,0];
console.log(can_win(solution_array,0,solution_array[0]));

