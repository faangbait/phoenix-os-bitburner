const find_largest_prime_factor = (target) => {
    var x = 2;
    while (x <= target) {
        if (target % x == 0) {
            target /= x;
        } else {
            x++;
        }
    }
    return x;
};
    
let solution_integer = 508007646;
console.log(find_largest_prime_factor(solution_integer));