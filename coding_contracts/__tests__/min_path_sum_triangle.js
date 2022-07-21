import { MinPathSumTriangle } from "../min_path_sum_triangle";
test('basic', () => {
    expect(MinPathSumTriangle.solve([[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]])).toBe(11);
    expect(MinPathSumTriangle.solve([[-10]])).toBe(-10);
});
test('tests', () => {
    expect(MinPathSumTriangle.answer([[3],
        [9, 3],
        [4, 4, 9],
        [1, 2, 2, 7],
        [8, 8, 9, 1, 9],
        [9, 4, 4, 1, 4, 6],
        [3, 6, 4, 5, 1, 3, 2],
        [6, 9, 3, 3, 4, 8, 6, 6],
        [5, 7, 6, 8, 4, 1, 4, 9, 5],
        [8, 5, 9, 2, 7, 9, 3, 8, 1, 7],
        [5, 3, 6, 2, 2, 4, 6, 3, 9, 5, 8]])).toBe(26);
});
