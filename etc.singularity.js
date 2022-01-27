/** @param {NS} ns **/


function scan(ns, parent, server, list) {
    const children = ns.scan(server);
    for (let child of children) {
        if (parent == child) {
            continue;
        }
        list.push(child);
        
        scan(ns, server, child, list);
    }
}

export function list_servers(ns) {
    const list = [];
    scan(ns, '', 'home', list);
    return list;
}

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


/**
 * Dynamic Programming solution.
 * Complexity: O(n)
 *
 * @param {Number[]} inputArray
 * @return {Number[]}
 */
 function dpMaximumSubarray(inputArray) {
    // We iterate through the inputArray once, using a greedy approach to keep track of the maximum
    // sum we've seen so far and the current sum.
    //
    // The currentSum variable gets reset to 0 every time it drops below 0.
    //
    // The maxSum variable is set to -Infinity so that if all numbers are negative, the highest
    // negative number will constitute the maximum subarray.
  
    let maxSum = -Infinity;
    let currentSum = 0;
  
    // We need to keep track of the starting and ending indices that contributed to our maxSum
    // so that we can return the actual subarray. From the beginning let's assume that whole array
    // is contributing to maxSum.
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
    return max.reduce((a,b) => a+b,0);
  }


const find_best_single_trade = (array) => {
    let best_single_trade = 0;
    let idx = 0;
    for (let cur of array) {
        for (let rest of array.slice(idx)) {
            if ((rest - cur) > best_single_trade) {
                best_single_trade = rest-cur;
            }
        }
        idx++;
    }
    return best_single_trade;
};

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
    return paths[r - 1];
};


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

export async function main(ns) {
	/*****************
	solve coding contracts

	*****************/
	let servers = list_servers(ns);


	for (let server of servers) {
        if (ns.ls(server,".cct").length > 0) {
            var contractName = ns.ls(server,".cct")[0];
            var result;
            ns.tprint("contract ", ns.codingcontract.getContractType(contractName,server), " on server ", server);
            switch(ns.codingcontract.getContractType(contractName, server)) {
                case "Spiralize Matrix":
                    result = spiralize_matrix(ns.codingcontract.getData(contractName, server));
                    ns.codingcontract.attempt(result, contractName, server);
                    break;
                case "Subarray with Maximum Sum":
                    result = dpMaximumSubarray(ns.codingcontract.getData(contractName, server));
                    ns.codingcontract.attempt(result, contractName, server);
                    break;
                case "Algorithmic Stock Trader I":
                    result = find_best_single_trade(ns.codingcontract.getData(contractName, server));
                    ns.codingcontract.attempt(result, contractName, server);
                    break;
                case "Algorithmic Stock Trader II":
                    result = find_cumulative_profit(ns.codingcontract.getData(contractName, server));
                    ns.codingcontract.attempt(result, contractName, server);
                    break;
                case "Unique Paths in a Grid II":
                    result = unique_paths_with_obstacles(ns.codingcontract.getData(contractName, server))[unique_paths_with_obstacles(ns.codingcontract.getData(contractName, server)).length-1];
                    ns.codingcontract.attempt(result, contractName, server);
                    break;
                case "Minimum Path Sum in a Triangle":
                    result = minSumPath(ns.codingcontract.getData(contractName, server));
                    ns.codingcontract.attempt(result, contractName, server);
                    break;
                default:
                    break;
            }
            
        }
    }

	while (true) {
		try {
			ns.upgradeHomeRam();
		} catch (e) {}
		await ns.sleep(60000);
	}
}