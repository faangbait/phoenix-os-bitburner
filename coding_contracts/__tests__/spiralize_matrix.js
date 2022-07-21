import { SpiralizeMatrix } from "../spiralize_matrix";
test('basic', () => {
    expect(SpiralizeMatrix.solve([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toStrictEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
    expect(SpiralizeMatrix.solve([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]])).toStrictEqual([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
    expect(SpiralizeMatrix.solve([
        [47, 42, 14, 23, 27, 4, 3, 49],
        [7, 44, 39, 44, 30, 33, 40, 39],
        [32, 4, 33, 28, 11, 6, 36, 1],
        [15, 21, 44, 1, 10, 50, 40, 5],
        [47, 47, 5, 16, 6, 33, 46, 28],
        [23, 30, 10, 5, 8, 36, 4, 48],
        [27, 15, 15, 7, 45, 2, 40, 48],
        [38, 25, 47, 41, 17, 13, 22, 34]
    ])).toStrictEqual([47, 42, 14, 23, 27, 4, 3, 49, 39, 1, 5, 28, 48, 48, 34, 22, 13, 17, 41, 47, 25, 38, 27, 23, 47, 15, 32, 7, 44, 39, 44, 30, 33, 40, 36, 40, 46, 4, 40, 2, 45, 7, 15, 15, 30, 47, 21, 4, 33, 28, 11, 6, 50, 33, 36, 8, 5, 10, 5, 44, 1, 10, 6, 16]);
});
test('onecol', () => {
    expect(SpiralizeMatrix.solve([[1], [2], [3]])).toStrictEqual([1, 2, 3]);
});
test('onerow', () => {
    expect(SpiralizeMatrix.solve([[1, 2, 3, 4, 5]])).toStrictEqual([1, 2, 3, 4, 5]);
    expect(SpiralizeMatrix.solve([[1]])).toStrictEqual([1]);
});
test('tests', () => {
    expect(SpiralizeMatrix.answer([[1, 2, 3], [4, 5, 6], [7, 8, 9]])).toStrictEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
});
