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
// Decode the string.
export const LZDecompression = {
    solve(params) {
        let decoded = '', type = 0, len, ref, pos, i = 0, j;
        while (i < params.length) {
            if (i > 0)
                type ^= 1;
            len = parseInt(params[i]);
            ref = parseInt(params[++i]);
            if (len === 0)
                continue;
            if (!isNaN(ref) && type === 1) {
                i++;
                for (j = 0; j < len; j++)
                    decoded += decoded[decoded.length - ref];
            }
            else {
                pos = i;
                for (; i < len + pos; i++)
                    decoded += params[i];
            }
        }
        return decoded;
    },
    tests(params) {
        [
            { params: '5aaabb450723abb', solution: 'aaabbaaababababaabb' },
        ].forEach(t => {
            if (LZDecompression.solve(t.params) !== t.solution) {
                throw "Test failed to pass";
            }
        });
        return LZDecompression.solve(params);
    },
    answer(params) { return LZDecompression.tests(params); }
};
