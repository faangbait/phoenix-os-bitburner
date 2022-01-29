/** @param {NS} ns **/

/**
 * Spiralize Matrix
 * Complexity O(n)? I think.
 *
 * @param {number[][]} matrix
 * @return {number[]} 
 */
export const spiralize_matrix = (matrix) => {
	var result = [];
	while (matrix.length > 0) {
		result.push(...matrix.shift());
		try {
			matrix = matrix[0].map((val, idx) => matrix.map(row => row[idx]).reverse()); // i only know how to rotate clockwise
			matrix = matrix[0].map((val, idx) => matrix.map(row => row[idx]).reverse()); // this solution wants it counterclockwise
			matrix = matrix[0].map((val, idx) => matrix.map(row => row[idx]).reverse()); // but three clockwise rotations is counter clockwise!
		} catch (e) {
			result.push(...matrix);
		}
	}
	return result;
};


/**
 * Total ways to sum to K with N integers.
 * Complexity O(N*K)
 *
 * @param {number} N
 * @param {number} K
 * @return {number} 
 */
export function twts(N, K)
{   
    let dp = Array.from({length: N +1}, (_, i) => 0);
    dp[0] = 1;
    for(let row = 1; row < K + 1; row++)
    {
        for(let col = 1; col < N + 1; col++)
        {
            if (col >= row)
                dp[col] = dp[col] + dp[col - row];
          }
    }
 
    return(dp[N]-1);
}

/**
 * 
 * Subarray with Maximum Sum
 * Complexity: O(n)
 *
 * @param {Number[]} inputArray
 * @return {Number[]}
 */
 export function dpMaximumSubarray(inputArray) {
	let maxSum = -Infinity;
	let currentSum = 0;
	let maxStartIndex = 0;
	let maxEndIndex = inputArray.length - 1;
	let currentStartIndex = 0;

	inputArray.forEach((currentNumber, currentIndex) => {
		currentSum += currentNumber;

		// Update maxSum and the corresponding indices if we have found a new max.
		if (maxSum < currentSum) {
			maxSum = currentSum;
			maxStartIndex = currentStartIndex;
			maxEndIndex = currentIndex;
		}

		// Reset currentSum and currentStartIndex if currentSum drops below 0.
		if (currentSum < 0) {
			currentSum = 0;
			currentStartIndex = currentIndex + 1;
		}
	});

	let max = inputArray.slice(maxStartIndex, maxEndIndex + 1);
	return max.reduce((a, b) => a + b, 0);
}
/**
 * Algorithmic Trading I
 *
 * @param {number[]} array
 * @return {number} 
 */
export const find_best_single_trade = (array) => {
	let best_single_trade = 0;
	let idx = 0;
	for (let cur of array) {
		for (let rest of array.slice(idx)) {
			if ((rest - cur) > best_single_trade) {
				best_single_trade = rest - cur;
			}
		}
		idx++;
	}
	return best_single_trade;
};

/**
 * Algorithmic Trading II
 *
 * @param {number[]} array
 * @return {number} 
 */
export const find_cumulative_profit = (array) => {
    return array.reduce(function (accumulator, current, idx, arr) {
        if (arr[idx+1] > current){
            // console.log("Index ", idx, " profit ", (arr[idx+1]-current), " cumulatively ", accumulator);
            return accumulator + (arr[idx+1]-current);
        } else { return accumulator || 0; }
    }, 0);
};


/**
 * Unique Paths in a Grid II
 *
 * @param {number[]} arr
 * @return {number} 
 */
export const unique_paths_with_obstacles = (arr) => {
	let r = arr.length,
		c = arr[0].length;

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
};


export const unique_paths_i = (arr) => {
    return unique_paths_with_obstacles(new Array(arr[0]).fill(new Array(arr[1]).fill(0)));
  };

/**
 * Find Largest Prime Factor
 *
 * @param {number} target
 * @return {number} 
 */
export const find_largest_prime_factor = (target) => {
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


// utility
export function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
}

// generate array jumping game graph
export const array_jumping_generate_graph = (solution_array) => {
    let graph = new Map();
    for (let i = 0; i < solution_array.length; i++) {
        graph.set(i, range(solution_array[i], i+1)
        );
    }
    return graph;
};

// traverse array jumping game graph
export const array_jumping_traverse_graph = (graph, source) => {
    const stack = [ source ];
    const result = [];
    const visited = {};
    visited [ source ] = true;
    let current;

    while (stack.length > 0) {
        current = stack.pop();
        // console.log(current);
        if (current >= graph.size) { return true; }
        result.push(current);
        try {
            graph.get(current).forEach(neighbor => {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    stack.push(neighbor);
                }
            });
        } catch (e) {
            console.log(e);
            return true;
        }
    }
    return false;
};
    
/**
 * Array Jumping Game
 *
 * @param {number[]} solution_array
 * @return {boolean} 
 */
export const array_jumping_can_win = (solution_array) => {
    let graph = array_jumping_generate_graph(solution_array);
    return array_jumping_traverse_graph(graph, 0);
};


/**
 * Minimum Sum Path in a Triangle
 *
 * @param {number[]} arr
 * @return {number} 
 */
export function minSumPath(arr) {

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


export const attemptContract = (name, type, data, server) => {

    var answer;

    switch (type) {
        case "Spiralize Matrix": 
            answer = spiralize_matrix(data);
            break;
        case "Subarray with Maximum Sum":
            answer = dpMaximumSubarray(data);
            ns.tprint(answer);
            break;
        case "Algorithmic Stock Trader I":
            answer = find_best_single_trade(data);
            break;
        case "Algorithmic Stock Trader II":
            answer = find_cumulative_profit(data);
            break;
        case "Unique Paths in a Grid I":
            answer = unique_paths_i(data);
            break;
        case "Unique Paths in a Grid II":
            answer = unique_paths_with_obstacles(data);
            break;
        case "Minimum Path Sum in a Triangle":
            answer = minSumPath(data);
            break;
        case "Array Jumping Game":
            answer = array_jumping_can_win(data);
            break;
        case "Find Largest Prime Factor":
            answer = find_largest_prime_factor(data);
            break;
        case "Total Ways to Sum":
            answer = twts(data);
            break;
        default:
            answer = null;
            break;
    }
    if (answer) {
        ns.tprint(ns.codingcontract.attempt(answer, name, server, {returnReward: true}));
    }
    
};
export const autoSolve = (ns, servers) => {
        for (let server of servers) {
            if (ns.ls(server, ".cct").length > 0) {
                var contractName = ns.ls(server, ".cct")[0];
                var contractData = ns.codingcontract.getData(contractName, server);
                var contractType = ns.codingcontract.getContractType(contractName, server);
                attemptContract(contractName, contractType, contractData, server);
            }
        }
};