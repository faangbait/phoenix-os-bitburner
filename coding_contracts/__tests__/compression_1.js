import { RLECompression } from "../compression_1";
test('basic', () => {
    expect(RLECompression.solve('aaaaabccc')).toBe('5a1b3c');
    expect(RLECompression.solve('aAaAaA')).toBe('1a1A1a1A1a1A');
    expect(RLECompression.solve('vvXXXXaa66SttvVVhh77BlEEmmmmmmmmmmmmLQQQQQQQPbbbbbbbbbbbbbbnnxOOOOOOOOOOOOQnrrIII')).toBe('2v4X2a261S2t1v2V2h271B1l2E9m3m1L7Q1P9b5b2n1x9O3O1Q1n2r3I');
    expect(RLECompression.solve('zzzzzzzzzzzzzzzzzzz')).toBe('9z9z1z');
});
test('tests', () => {
    expect(RLECompression.solve('111112333')).toBe('511233');
});
