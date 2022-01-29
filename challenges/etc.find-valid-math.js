// You are given the following string which contains only digits between 0 and 9:

// 728082

// You are also given a target number of -90. Return all possible ways you can add the +, -, and * operators to the string such that it evaluates to the target number.

// The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:

// ["728082", -90]

// NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:

// Input: digits = "123", target = 6
// Output: [1+2+3, 1*2*3]

// Input: digits = "105", target = 5
// Output: [1*0+5, 10-5]

var target = 6;
var int = 123;

let intstring = int.toString();
let intarr = Array.from(...intstring.split());
intarr = intarr.map(i => parseInt(i));
console.log(intarr);
var solutions = [];
let count = 0;
var add=[];
var sub=[];
var mult=[];
 for (let i = 0; i < intarr.length - 1; i++) {
    // for (let k = 0; k < intarr.length; k++) {
        if (target == intarr.reduce(function(acc, acc, idx, arr){

            for (let j = 0; j < 3; j++) {
                count++;

                if (j == 0) {
                    if (acc + intarr[i] + arr[idx] == target) {
                        add.push(`${acc} + ${intarr[i]} + ${arr[idx]}`);
                    }
                    
                    return acc+intarr[i]+acc;
                    
                }
                if (j == 1) {
                    if (acc + intarr[i] - arr[idx] == target) {
                        add.push(`${acc} + ${intarr[i]} - ${arr[idx]}`);
                    }
                    return acc+intarr[i]-acc;return acc - acc;
                    console.log(arr[idx]-intarr[i]);
                }
                if (j == 2) {
                    if (acc + intarr[i] * arr[idx] == target) {
                        add.push(`${acc} + ${intarr[i]} * ${arr[idx]}`);
                    }
                    return acc+intarr[i]*acc;
                    console.log();
                }
    
        }
        },0)) {
            solutions.push(target);
        }
    
        if (target == intarr.reduce(function(acc, acc, idx, arr){

            for (let j = 0; j < 3; j++) {
                count++;

                if (j == 0) {
                    if (acc  - intarr[i] + arr[idx] == target) {
                        add.push(`${acc} - ${intarr[i]} + ${arr[idx]}`);
                    }
                    return acc-intarr[i]+acc;
                    console.log(arr[idx]+intarr[i]);
                }
                if (j == 1) {
                    if (acc - intarr[i] - arr[idx] == target) {
                        add.push(`${acc} - ${intarr[i]} - ${arr[idx]}`);
                    }
                    return acc-intarr[i]-acc;return acc - acc;
                    console.log(arr[idx]-intarr[i]);
                }
                if (j == 2) {
                    if (acc - intarr[i] * arr[idx] == target) {
                        add.push(`${acc} - ${intarr[i]} * ${arr[idx]}`);
                    }
                    return acc-intarr[i]*acc;
                    console.log();
                }
    
        }
        },0)) {
            solutions.push(target);
        }
        if (target == intarr.reduce(function(acc, acc, idx, arr){

            for (let j = 0; j < 3; j++) {
                count++;

                if (j == 0) {
                    if (acc * intarr[i] + arr[idx] == target) {
                        add.push(`${acc} * ${intarr[i]} + ${arr[idx]}`);
                    }
                    return acc*intarr[i]+acc;
                    add.push([intarr[i], acc])
                    console.log(arr[idx]+intarr[i]);
                }
                if (j == 1) {
                    if (acc * intarr[i] - arr[idx] == target) {
                        add.push(`${acc} * ${intarr[i]} - ${arr[idx]}`);
                    }
                    return acc*intarr[i]-acc;return acc - acc;
                    console.log(arr[idx]-intarr[i]);
                }
                if (j == 2) {
                    if (acc * intarr[i] * arr[idx] == target) {
                        add.push(`${acc} * ${intarr[i]} * ${arr[idx]}`);
                    }
                    return acc*intarr[i]*acc;
                    console.log();
                }
    
        }
        },0)) {
            solutions.push(target);
        }
    
    
    }
    
// }

// console.log(solutions);
// console.log(count, " count");
console.log(add);
// console.log(sub);
// console.log(mult);
