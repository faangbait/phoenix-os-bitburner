// Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to
// earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk
// begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data,
// which is either:
// 1. Exactly L characters, which are to be copied directly into the uncompressed data.
// 2. A reference to an earlier part of the uncompressed data. To do this, the length is followed
// by a second ASCII digit X: each of the L output characters is a copy of the character X
// places before it in the uncompressed data.
// For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character
// is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final
// chunk may be of either type.
// Encode it using Lempel-Ziv encoding with the minimum possible output length
export const LZCompression = {
    solve(params) {
        function set(state, i, j, str) {
            if (state[i][j] === undefined || str.length < state[i][j].length)
                state[i][j] = str;
        }
        let cur_state = Array.from(Array(10), _ => Array(10)), new_state, tmp_state, result;
        cur_state[0][1] = ''; // initial state is a literal of length 1
        for (let i = 1; i < params.length; i++) {
            new_state = Array.from(Array(10), _ => Array(10));
            const c = params[i];
            // handle literals
            for (let len = 1; len <= 9; len++) {
                const input = cur_state[0][len];
                if (input === undefined)
                    continue;
                if (len < 9)
                    set(new_state, 0, len + 1, input); // extend current literal
                else
                    set(new_state, 0, 1, input + '9' + params.substring(i - 9, i) + '0'); // start new literal
                for (let offset = 1; offset <= Math.min(9, i); offset++) { // start new backreference
                    if (params[i - offset] === c)
                        set(new_state, offset, 1, input + len + params.substring(i - len, i));
                }
            }
            // handle backreferences
            for (let offset = 1; offset <= 9; offset++) {
                for (let len = 1; len <= 9; len++) {
                    const input = cur_state[offset][len];
                    if (input === undefined)
                        continue;
                    if (params[i - offset] === c) {
                        if (len < 9)
                            set(new_state, offset, len + 1, input); // extend current backreference
                        else
                            set(new_state, offset, 1, input + '9' + offset + '0'); // start new backreference
                    }
                    set(new_state, 0, 1, input + len + offset); // start new literal
                    // end current backreference and start new backreference
                    for (let new_offset = 1; new_offset <= Math.min(9, i); new_offset++) {
                        if (params[i - new_offset] === c)
                            set(new_state, new_offset, 1, input + len + offset + '0');
                    }
                }
            }
            tmp_state = new_state;
            new_state = cur_state;
            cur_state = tmp_state;
        }
        for (let len = 1; len <= 9; len++) {
            let input = cur_state[0][len];
            if (input === undefined)
                continue;
            input += len + params.substring(params.length - len, params.length);
            // noinspection JSUnusedAssignment
            if (result === undefined || input.length < result.length)
                result = input;
        }
        for (let offset = 1; offset <= 9; offset++) {
            for (let len = 1; len <= 9; len++) {
                let input = cur_state[offset][len];
                if (input === undefined)
                    continue;
                input += len + '' + offset;
                if (result === undefined || input.length < result.length)
                    result = input;
            }
        }
        return result ?? '';
    },
    tests(params) {
        [
            { params: 'abracadabra', solution: '7abracad47' },
            { params: 'mississippi', solution: '4miss433ppi' },
            { params: 'aAAaAAaAaAA', solution: '3aAA53035' },
            { params: '2718281828', solution: '627182844' },
            { params: 'abcdefghijk', solution: '9abcdefghi02jk' },
            { params: 'aaaaaaaaaaaa', solution: '3aaa91' },
            { params: 'aaaaaaaaaaaaa', solution: '1a91031' },
            { params: 'aaaaaaaaaaaaaa', solution: '1a91041' },
        ].forEach(t => {
            if (LZCompression.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return LZCompression.solve(params);
    },
    answer(params) { return LZCompression.tests(params); }
};
