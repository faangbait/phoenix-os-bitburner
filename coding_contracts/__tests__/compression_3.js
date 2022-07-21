import { LZCompression } from "../compression_3";
test('basic', () => {
    expect(LZCompression.solve('mississippi')).toBe('4miss433ppi');
    expect(LZCompression.solve('abcdefghijk')).toBe('9abcdefghi02jk');
    expect(LZCompression.solve('aaaaaaaaaaaaa')).toBe('1a91031');
});
test('tests', () => {
    expect(LZCompression.answer('abracadabra')).toBe('7abracad47');
});
