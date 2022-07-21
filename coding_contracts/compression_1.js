// Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of
// a repeated single character. Runs are encoded as a length, followed by the character itself. Lengths
// are encoded as a single ASCII digit; runs of 10 characters or more are encoded by splitting them
// into multiple runs.
export const RLECompression = {
    solve(params) {
        let i = 0;
        let encoding = "";
        while (i < params.length) {
            let count = 1;
            while (i + 1 < params.length && params[i] === params[i + 1]) {
                count++;
                i++;
            }
            while (count > 9) {
                let carry = count -= 9;
                encoding += "9" + params[i];
            }
            encoding += count.toString() + params[i];
            i++;
        }
        return encoding;
    },
    tests(params) {
        [
            { params: 'aaaaabccc', solution: '5a1b3c' },
            { params: 'aAaAaA', solution: '1a1A1a1A1a1A' },
            { params: '111112333', solution: '511233' },
        ].forEach(t => {
            if (RLECompression.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return RLECompression.solve(params);
    },
    answer(params) { return RLECompression.tests(params); }
};
