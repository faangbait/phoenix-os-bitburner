// Given the following string containing only digits, return
// an array with all possible valid IP address combinations
// that can be created from the string
export const GenerateIP = {
    solve(params) {
        function isValidIpSegment(segment) {
            return !((segment[0] === '0' && segment !== '0') || segment > 255);
        }
        const ips = [];
        for (let i = 1; i < params.length - 2; i++) {
            for (let j = i + 1; j < params.length - 1; j++) {
                for (let k = j + 1; k < params.length; k++) {
                    const ip = [
                        params.slice(0, i),
                        params.slice(i, j),
                        params.slice(j, k),
                        params.slice(k)
                    ];
                    let isValid = true;
                    ip.forEach(seg => {
                        isValid = isValid && isValidIpSegment(seg);
                    });
                    if (isValid)
                        ips.push(ip.join('.'));
                }
            }
        }
        return ips;
    },
    tests(params) {
        // if (![
        //     { params: "25525511135", solution: ["255.255.11.135", "255.255.111.35"] },
        //     { params: "1938718066", solution: ["193.87.180.66"]},
        //     { params: "0000", solution: ["0.0.0.0"] },
        //     { params: "101023", solution: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]}
        // ].every(t => {
        //     GenerateIP.solve(t.params).every(s => {
        //         t.solution.includes(s) && t.solution.length === GenerateIP.solve(t.params).length
        //     })
        // })) { throw "Tests failed to pass"}
        return GenerateIP.solve(params);
    },
    answer(params) { return GenerateIP.tests(params); }
};
