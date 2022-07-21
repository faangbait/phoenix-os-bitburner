import { LZDecompression } from "../compression_2";
// test('basic', () => {
// })
test('tests', () => {
    expect(LZDecompression.answer('5aaabb450723abb')).toBe('aaabbaaababababaabb');
});
